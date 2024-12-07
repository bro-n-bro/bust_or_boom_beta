import { defineStore } from 'pinia'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

const jetpack = new JetPack()


export const useGlobalStore = defineStore('global', {
    state: () => ({
        isConnected: false,
        isRegistered: null,

        user: null,
        balance: null,
        roundInfo: null,
        priceInfo: null,

        websocket: null,
        client: null,

        chainID: 'pion-1',
        exponent: 6,
        symbol: 'BOOM'
    }),


    actions: {
        async connectWallet() {
            try {
                await jetpack.connectWallet(this.chainID).then(async () => {
                    this.isConnected = true

                    this.client = await CosmWasmClient.connect('https://rpc.pion-1.bronbro.io')

                    return true
                })
            } catch(error) {
                console.log(error)

                return false
            }
		},


        getUserAddress() {
            return jetpack.getAddress()
        },


        async checkUserAccount() {
            try {
                this.user = await this.client.queryContractSmart('neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k', {
                    user_by_address: {
                        address: jetpack.getAddress()
                    }
                })

                await Promise.all([
                    this.getPriceInfo(),
                    this.getRoundInfo(),
                    this.loadBalances(),
                ])

                this.connectWebsocket()

                this.isRegistered = true
            } catch (error) {
                this.isRegistered = false
            }
        },


        async createUserAccount({ username, display_name }) {
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
                if (result.type === 'error') {
                    console.log(error)

                    return false
                }

                if (result.type === 'tx') {
                    await this.checkUserAccount()

                    return true
                }
            }).catch(error => {
                console.log(error)

                return false
            })
        },


        async loadBalances() {
            await jetpack.loadBalances().then(() => {
                this.balance = jetpack.getBalances().find(el => el.denom === 'factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom')
            })
        },


        async connectWebsocket() {
            if (this.websocket) {
                this.websocket.onopen = null
                this.websocket.onmessage = null

                this.websocket.close()
            }

            this.websocket = new WebSocket('wss://rpc.pion-1.bronbro.io:443/websocket')

            this.websocket.onopen = () => {
                this.websocket.send(JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'subscribe',
                    id: '1',
                    params: {
                        query: "tm.event='NewBlock'"
                    }
                }))
            }

            this.websocket.onmessage = async msg => {
                this.ChainBlockInfo = JSON.parse(msg.data)

                this.getPriceInfo()

                this.getRoundInfo()
            }
        },


        async getPriceInfo() {
            try {
                await fetch('https://lcd.pion-1.bronbro.io/slinky/oracle/v1/get_price?currency_pair.Base=ATOM&currency_pair.Quote=USD')
                    .then(response => response.json())
                    .then(data => this.priceInfo = data)
            } catch (error) {
                console.error(error)
            }
        },


        async getRoundInfo() {
            try {
                this.roundInfo = await this.client.queryContractSmart('neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc', {
                    status: {}
                })

                return true
            } catch (error) {
                return false
            }
        },


        async faucet() {
            try {
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
                    .then(response => response.json())
                    .then(data => console.log(data))
            } catch (error) {
                console.error(error)
            }
        }
    }
})