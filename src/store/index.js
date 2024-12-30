import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
// import JetPack from 'jetpack'


// Init jetPack
const jetpack = new JetPack(true)


export const useGlobalStore = defineStore('global', {
    state: () => ({
        isRTCConnected: false,
        isConnected: false,
        isRegistered: null,

        user: null,
        balance: null,
        roundInfo: null,
        priceInfo: null,

        websocket: null,
        client: null,

        bets: useLocalStorage('bets', []),

        chainID: 'pion-1',
        exponent: 6,
        symbol: 'BOOM'
    }),


    actions: {
        // Init
        init() {
            // Connect event
            jetpack.on('connect', () => {
                this.isRTCConnected = true
            })

            // Disconnect event
            jetpack.on('disconnect', () => {
                this.isRTCConnected = false
            })

            // Close event
            jetpack.on('close', () => {
                this.isRTCConnected = false
            })
        },


        // Connect wallet
        async connectWallet() {
            try {
                // Connect wallet request
                await jetpack.connectWallet(this.chainID).then(async () => {
                    // Create CosmWasmClient
                    this.client = await CosmWasmClient.connect('https://rpc.pion-1.bronbro.io')

                    // Set connected status
                    this.isConnected = true
                })
            } catch(error) {
                alert(error)
            }
		},


        // Get user address
        getUserAddress() {
            return jetpack.getAddress()
        },


        // Check user account
        async checkUserAccount() {
            try {
                // Check user account request
                this.user = await this.client.queryContractSmart('neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k', {
                    user_by_address: {
                        address: jetpack.getAddress()
                    }
                })

                // Get round info
                await this.getRoundInfo()

                // Wait promise
                await Promise.all([
                    this.getPriceInfo(),
                    this.loadBalances()
                ])

                // Set websocket connect
                this.connectWebsocket()

                // Set registered status
                this.isRegistered = true
            } catch (error) {
                // Set registered status
                this.isRegistered = false
            }
        },


        // Create user account
        async createUserAccount({ username, display_name }) {
            // Create user account request
            return await jetpack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: jetpack.getAddress(),
                    contract: 'neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k',
                    msg: new TextEncoder().encode(JSON.stringify({
                        modify_user: {
                            user: {
                                display_name: display_name,
                                username: username
                            }
                        }
                    }))
                }
            }]).then(async (result) => {
                // Get error as a result
                if (result.type === 'error') {
                    console.log(error)

                    return false
                }

                // Get tx as a result
                if (result.type === 'tx') {
                    // Check user account
                    await this.checkUserAccount()

                    return true
                }
            }).catch(error => {
                console.log(error)

                return false
            })
        },


        // Get balances
        async loadBalances() {
            // Get balances request
            await jetpack.loadBalances().then(() => {
                // Set balances
                this.balance = jetpack.getBalances().find(el => el.denom === 'factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom')
            })
        },


        // Set websocket connect
        async connectWebsocket() {
            // Reset connection
            if (this.websocket) {
                this.websocket.onopen = null
                this.websocket.onmessage = null

                this.websocket.close()
            }

            // Create connection
            this.websocket = new WebSocket('wss://rpc.pion-1.bronbro.io:443/websocket')

            // Connection open event
            this.websocket.onopen = () => {
                // Subscribe to new blocks
                this.websocket.send(JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'subscribe',
                    id: '1',
                    params: {
                        query: "tm.event='NewBlock'"
                    }
                }))
            }

            // Connection message event
            this.websocket.onmessage = async msg => {
                // Set block info
                this.ChainBlockInfo = JSON.parse(msg.data)

                // Get round info
                await this.getRoundInfo()

                // Get price info
                await this.getPriceInfo()
            }
        },


        // Get price info
        async getPriceInfo() {
            try {
                // Get price info request
                await fetch('https://lcd.pion-1.bronbro.io/slinky/oracle/v1/get_price?currency_pair.Base=ATOM&currency_pair.Quote=USD')
                    .then(response => response.json())
                    .then(data => {
                        data.price.price = data.price.price.padEnd(this.roundInfo?.live_round?.open_price.length, '0')
                        data.decimals = this.roundInfo?.live_round?.open_price.length - 1

                        // Set price info
                        this.priceInfo = data
                    })
            } catch (error) {
                console.error(error)
            }
        },


        // Get round info
        async getRoundInfo() {
            try {
                // Get round info request
                this.roundInfo = await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    status: {}
                })

                return true
            } catch (error) {
                return false
            }
        },


        // Faucet
        async faucet() {
            try {
                // Faucet request
                await fetch('https://pion.tap.bronbro.io/claim_rewards/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        telegram_id: jetpack.getTgUserID(),
                        address: jetpack.getAddress()
                    })
                })
            } catch (error) {
                console.error(error)
            }
        },


        // Create bet
        async createBet({ amount, prize, round_id, type }) {
            let msg = {}

            // Bear bet
            if (type === 'bear') {
                msg = {
                    bet_bear: {
                        amount: String(amount * Math.pow(10, this.exponent)),
                        round_id: String(round_id)
                    }
                }
            }

            // Bull bet
            if (type === 'bull') {
                msg = {
                    bet_bull: {
                        amount: String(amount * Math.pow(10, this.exponent)),
                        round_id: String(round_id)
                    }
                }
            }

            // Create bet request
            await jetpack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: jetpack.getAddress(),
                    contract: 'neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc',
                    msg: new TextEncoder().encode(JSON.stringify(msg)),
                    funds: [{
                        denom: 'factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom',
                        amount: String(amount * Math.pow(10, this.exponent))
                    }]
                }
            }]).then((result) => {
                // Get error as a result
                if (result.type === 'error') {
                    console.log(error)
                }

                // Get tx as a result
                if (result.type === 'tx') {
                    this.bets.push({
                        bet_id: Date.now(),
                        type: type,
                        amount: amount,
                        prize: prize,
                        round_id: round_id,
                        roundInfo: this.roundInfo,
                        finished_round: null
                    })

                    // Sort bets
                    this.bets.sort((a, b) => b.bet_id - a.bet_id)

                    // Update balances
                    this.loadBalances()
                }
            }).catch(error => {
                console.log(error)
            })
        },


        // Delete bet
        deleteBet(bet_id) {
            // Update bets
            this.bets = this.bets.filter(bet => bet.bet_id !== bet_id)
        },


        // Get finished round
        async getFinishedRound(round_id) {
            try {
                // Get finished round request
                return await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    finished_round: {
                        round_id: String(round_id)
                    }
                })
            } catch (error) {
                return false
            }
        },


        // Get rewards
        async myRewards() {
            try {
                // Get rewards request
                return await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    my_pending_reward_rounds: {
                        player: jetpack.getAddress()
                    }
                })
            } catch (error) {
                return false
            }
        },


        // Claim rewards
        async claimRewards() {
            // Claim rewards request
            await jetpack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: jetpack.getAddress(),
                    contract: 'neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc',
                    msg: new TextEncoder().encode(JSON.stringify({ collect_winnings: {} }))
                }
            }]).then((result) => {
                // Get error as a result
                if (result.type === 'error') {
                    console.log(error)
                }

                // Get tx as a result
                if (result.type === 'tx') {
                    console.log(result)
                }
            }).catch(error => {
                console.log(error)
            })
        },


        // Get leaderbpard
        async getLeaderbpard() {
            try {
                // Get leaderbpard request
                return await this.client.queryContractSmart('neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k', {
                    users: {}
                })
            } catch (error) {
                return false
            }
        }
    }
})