<template>
    <TopPanel />

    <section class="my_bets_page">
        <div class="filter">
            <button class="btn" @click.prevent="setFilter('*')" :class="{ active: filter === '*' }">All</button>

            <button class="btn" @click.prevent="setFilter('live')" :class="{ active: filter === 'live' }">Live</button>

            <button class="btn" @click.prevent="setFilter('won')" :class="{ active: filter === 'won' }">Won</button>

            <button class="btn" @click.prevent="setFilter('lose')" :class="{ active: filter === 'lose' }">Lose</button>
        </div>

        <div class="list" v-if="filterResult.length && !loading">
            <div class="bet" v-for="(bet, index) in filterResult" :key="index">
                <div class="live" v-if="!bet.finished_round">
                    <div class="head">
                        <div class="fixed_price">
                            <div class="label">Round Price</div>

                            <div class="val">
                                {{ calcFixedPrice(bet.roundInfo.live_round.open_price).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                            </div>
                        </div>

                        <img src="@/assets/ic_vs.svg" alt="" class="vs">

                        <div class="current_price">
                            <div class="label">Live Price</div>

                            <div class="val" :class="{
                                green: calcFixedPrice(bet.roundInfo.live_round.open_price) <= calcCurrentPrice(),
                                red: calcFixedPrice(bet.roundInfo.live_round.open_price) > calcCurrentPrice()
                            }">
                                {{ calcCurrentPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                            </div>
                        </div>
                    </div>

                    <div class="image">
                        <img src="@/assets/live_bet_img2.png" alt="" v-if="bet.type === 'bull' && calcFixedPrice(bet.roundInfo.live_round.open_price) <= calcCurrentPrice()">
                        <img src="@/assets/live_bet_img.png" alt="" v-if="bet.type === 'bull' && calcFixedPrice(bet.roundInfo.live_round.open_price) > calcCurrentPrice()">

                        <img src="@/assets/live_bet_img3.png" alt="" v-if="bet.type === 'bear' && calcFixedPrice(bet.roundInfo.live_round.open_price) <= calcCurrentPrice()">
                        <img src="@/assets/live_bet_img2.png" alt="" v-if="bet.type === 'bear' && calcFixedPrice(bet.roundInfo.live_round.open_price) > calcCurrentPrice()">
                    </div>

                    <div class="bottom">
                        <div class="amount">
                            <div class="label">Your Вet:</div>

                            <div class="val">
                                <img src="@/assets/ic_arrow_up.svg" alt="" v-if="bet.type === 'bull'">
                                <img src="@/assets/ic_arrow_down.svg" alt="" v-if="bet.type === 'bear'">

                                {{ bet.amount }} Boom
                            </div>
                        </div>

                        <div class="timer">
                            <div class="label">Round’s End:</div>

                            <div class="val">
                                <vue-countdown :time="calcTimerTime(bet)" v-slot="{ minutes, seconds }">
                                    {{ minutes < 10 ? '0' + minutes : minutes }} : {{ seconds < 10 ? '0' + seconds : seconds }}
                                </vue-countdown>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="finished" v-else>
                    <button class="delete_btn" @click.prevent="deleteBet(bet.bet_id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M17.3957 7.81286C17.7295 7.47912 17.7295 6.93802 17.3957 6.60429C17.062 6.27055 16.5209 6.27055 16.1871 6.60429L12 10.7914L7.81286 6.60429C7.47912 6.27055 6.93802 6.27055 6.60429 6.60429C6.27055 6.93802 6.27055 7.47912 6.60429 7.81286L10.7914 12L6.60429 16.1871C6.27055 16.5209 6.27055 17.062 6.60429 17.3957C6.93802 17.7295 7.47912 17.7295 7.81286 17.3957L12 13.2086L16.1871 17.3957C16.5209 17.7295 17.062 17.7295 17.3957 17.3957C17.7295 17.062 17.7295 16.5209 17.3957 16.1871L13.2086 12L17.3957 7.81286Z" fill="currentColor"/>
                        </svg>
                    </button>

                    <div class="image">
                        <img src="@/assets/bet_result_won.jpg" alt="" v-if="bet.finished_round.winner === bet.type">
                        <img src="@/assets/bet_result_lose.jpg" alt="" v-else>
                    </div>

                    <div>
                        <div class="prices">
                            <span>{{ calcFixedPrice(bet.roundInfo.live_round.open_price).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>

                            Vs.

                            <span>{{ calcFinishedPrice(bet.finished_round.close_price).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
                        </div>

                        <div class="status">
                            <span class="green" v-if="bet.finished_round.winner === bet.type">You won</span>
                            <span class="red" v-else>You lose</span>
                        </div>

                        <div class="prize">
                            <span v-if="bet.finished_round.winner === bet.type">{{ bet.prize.toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }} Boom</span>
                            <span v-else>-{{ bet.amount }} Boom</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="empty" v-else>You have no current bets.</div>

        <button class="claim_btn" @click.prevent="claimRewards()" v-if="isRewards">Claim Rewards</button>
    </section>

    <BottomPanel />
</template>


<script setup>
    import { ref, onBeforeMount, watch, computed } from 'vue'
    import { useGlobalStore } from '@/store'

    import TopPanel from '@/components/TopPanel.vue'
    import BottomPanel from '@/components/BottomPanel.vue'


    const store = useGlobalStore(),
        isRewards = ref(0),
        filter = ref('*'),
        filterResult = ref([]),
        loading = ref(true)


    onBeforeMount(async () => {
        store.bets.forEach(async bet => bet.finished_round = await store.getFinishedRound(bet.roundInfo.bidding_round.id))

        filterResult.value = store.bets

        isRewards.value = parseInt((await store.myRewards()).pending_reward_total)

        loading.value = false
    })


    watch(computed(() => store.roundInfo.bidding_round.id), async () => {
        loading.value = true

        store.bets.forEach(async bet => {
            if (bet.round_id === bet.roundInfo.live_round.id) {
                bet.roundInfo.bidding_round.close_time = bet.roundInfo.live_round.close_time
            }

            bet.finished_round = await store.getFinishedRound(bet.roundInfo.bidding_round.id)
        })

        filterResult.value = store.bets

        isRewards.value = parseInt((await store.myRewards()).pending_reward_total)

        loading.value = false
    })


    function setFilter(newValue) {
        filter.value = newValue

        if (filter.value === '*') {
            filterResult.value = store.bets
        }

        if (filter.value === 'live') {
            filterResult.value = store.bets.filter(bet => !bet.finished_round)
        }

        if (filter.value === 'won') {
            filterResult.value = store.bets.filter(bet => bet.finished_round && bet.finished_round.winner === bet.type)
        }

        if (filter.value === 'lose') {
            filterResult.value = store.bets.filter(bet => bet.finished_round && bet.finished_round.winner !== bet.type)
        }
    }


    function deleteBet(bet_id) {
        store.deleteBet(bet_id)
    }


    function calcCurrentPrice() {
        return store.priceInfo.price.price / Math.pow(10, store.priceInfo.decimals)
    }


    function calcFixedPrice(price) {
        return Number(String(price).slice(0, store.priceInfo.price.price.length)) / Math.pow(10, store.priceInfo.decimals)
    }


    function calcTimerTime(bet) {
        return (Number(bet.roundInfo.bidding_round.close_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)
    }


    function calcFinishedPrice(close_price) {
        return Number(String(close_price).slice(0, store.priceInfo.price.price.length)) / Math.pow(10, store.priceInfo.decimals)
    }


    async function claimRewards() {
        await store.claimRewards()

        await store.loadBalances()

        isRewards.value = 0
    }
</script>


<style scoped>
.my_bets_page
{
    padding-top: 72px;
    padding-bottom: 62px;
}


.filter
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    width: calc(100% - 20px);
    margin: 0 10px 10px;

    border: 1px solid #252849;
    border-radius: 6px;
    background: #000e01;
}


.filter .btn
{
    font-size: 16px;
    font-weight: 500;

    width: 100%;
    height: 24px;

    transition: .2s linear;
}


.filter .btn.active
{
    background: #252849;
}



.list
{
    display: flex;
    flex-direction: column;

    padding: 0 10px 82px;

    gap: 10px;
}



.bet
{
    position: relative;
}


.bet .delete_btn
{
    position: absolute;
    top: 5px;
    right: 5px;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 24px;
    height: 24px;
}


.bet .delete_btn svg
{
    display: block;

    width: 24px;
    height: 24px;
}



.bet .live
{
    position: relative;

    padding: 10px;

    border-radius: 12px;
    background: #001802;
}


.bet .live .head
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-bottom: 30px;
    padding: 10px 10px 8px;

    border-radius: 6px;
    background: #000e01;
}


.bet .live .head .label
{
    font-weight: 600;
}


.bet .live .head .val
{
    font-size: 24px;
    font-weight: 700;
}


.bet .live .head .val.green
{
    color: #00d712;
}

.bet .live .head .val.red
{
    color: #f00;
}


.bet .live .head .vs
{
    display: block;

    width: 42px;
}


.bet .live .image
{
    display: flex;
    align-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    justify-content: center;

    margin-bottom: 20px;
}


.bet .live .image img
{
    display: block;

    width: 280px;
    max-width: 100%;
}


.bet .live .bottom
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    padding: 10px;

    border-radius: 6px;
    background: #000e01;
}


.bet .live .bottom .label
{
    font-size: 16px;
    font-weight: 600;
}


.bet .live .bottom .val
{
    font-size: 35px;
    font-weight: 700;
    line-height: 100%;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    color: #fff200;

    gap: 4px;
}


.bet .live .bottom .val img
{
    display: block;

    width: 36px;
    height: 36px;
}



.bet .finished
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    padding: 10px;

    border-radius: 12px;
    background: #001802;

    gap: 10px;
}


.bet .finished .image
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 110px;
    height: 110px;
}


.bet .finished .image img
{
    display: block;

    max-width: 100%;
    max-height: 100%;
}


.bet .finished .image + *
{
    width: calc(100% - 120px);

    text-align: center;
}


.bet .finished .prices
{
    font-weight: 600;
}


.bet .finished .prices span
{
    font-size: 20px;
}



.bet .finished .status
{
    font-size: 32px;
    font-weight: 600;
}


.bet .finished .status .green
{
    color: #09ff00;
}

.bet .finished .status .red
{
    color: #f00;
}


.bet .finished .prize
{
    font-size: 20px;
    font-weight: 600;
}



.empty
{
    font-size: 20px;
    font-weight: 600;

    padding: 24px 12px;

    text-align: center;

    opacity: .75;
}



.claim_btn
{
    font-weight: 500;

    position: fixed;
    z-index: 9;
    right: 0;
    bottom: 72px;
    left: 0;

    width: calc(100% - 40px);
    height: 52px;
    margin: 0 auto;

    border-radius: 12px;
    background: #0f73ff;
    box-shadow: 0 0 15px #062600;
}
</style>