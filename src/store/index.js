import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
// import JetPack from 'jetpack'


// Init jetPack
window.jetPack = new JetPack()


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
            window.jetPack.on('connect', () => {
                this.isRTCConnected = true
            })

            // Disconnect event
            window.jetPack.on('disconnect', () => {
                this.isRTCConnected = false
            })

            // Close event
            window.jetPack.on('close', () => {
                this.isRTCConnected = false
            })
        },


        // Connect wallet
        async connectWallet() {
            try {
                // Connect wallet request
                await window.jetPack.connectWallet(this.chainID).then(async () => {
                    // Create CosmWasmClient
                    this.client = await CosmWasmClient.connect('https://rpc.pion-1.bronbro.io')

                    // Set connected status
                    this.isConnected = true
                })
            } catch(error) {
                // Throwing an exception
                throw error
            }
		},


        // Get user address
        getUserAddress() {
            return window.jetPack.getAddress()
        },


        // Check user account
        async checkUserAccount() {
            try {
                // Check user account request
                this.user = await this.client.queryContractSmart('neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k', {
                    user_by_address: {
                        address: window.jetPack.getAddress()
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

                // Throwing an exception
                throw error
            }
        },


        // Create user account
        async createUserAccount({ username, display_name }) {
            // Create user account request
            return await window.jetPack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: window.jetPack.getAddress(),
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
                    // Throwing an exception
                    throw error
                }

                // Get tx as a result
                if (result.type === 'tx') {
                    // Check user account
                    await this.checkUserAccount()

                    return true
                }
            }).catch(error => {
                // Throwing an exception
                throw error
            })
        },


        // Get balances
        async loadBalances() {
            // Get balances request
            await window.jetPack.loadBalances().then(() => {
                // Set balances
                this.balance = window.jetPack.getBalances().find(el => el.denom === 'factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom')
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
                        // Set price info
                        this.priceInfo = data

                        // Update live round price
                        this.roundInfo.live_round.open_price = this.roundInfo.live_round.open_price.slice(0, this.priceInfo.price.price.length)

                        // Set price decimals
                        this.roundInfo.live_round.decimals = this.priceInfo.decimals
                    })
            } catch (error) {
                // Throwing an exception
                throw error
            }
        },


        // Get round info
        async getRoundInfo() {
            try {
                // Get round info request
                this.roundInfo = await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    status: {}
                })
            } catch (error) {
                // Throwing an exception
                throw error
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
                        telegram_id: window.jetPack.getTgUserID(),
                        address: window.jetPack.getAddress()
                    })
                })
            } catch (error) {
                // Throwing an exception
                throw error
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
            await window.jetPack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: window.jetPack.getAddress(),
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
                    // Throwing an exception
                    throw error
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
                // Throwing an exception
                throw error
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
                let result =  await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    finished_round: {
                        round_id: round_id
                    }
                })

                // Format prices
                result.close_price = result.close_price.slice(0, this.priceInfo.price.price.length)
                result.open_price = result.open_price.slice(0, this.priceInfo.price.price.length)

                return result
            } catch (error) {
                // Throwing an exception
                throw error
            }
        },


        // Get rewards
        async myRewards() {
            try {
                // Get rewards request
                return await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    my_pending_reward_rounds: {
                        player: window.jetPack.getAddress()
                    }
                })
            } catch (error) {
                // Throwing an exception
                throw error
            }
        },


        // Claim rewards
        async claimRewards() {
            // Claim rewards request
            await window.jetPack.sendTx([{
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: {
                    sender: window.jetPack.getAddress(),
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
                // Throwing an exception
                throw error
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
                // Throwing an exception
                throw error
            }
        }
    }
})