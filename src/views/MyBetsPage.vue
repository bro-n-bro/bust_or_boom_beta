<template>
    <!-- Top panel -->
    <TopPanel />


    <!-- My bets page -->
    <section class="my_bets_page">
        <!-- My bets page - Filter -->
        <div class="filter">
            <!-- My bets page - Filter button -->
            <button class="btn" @click.prevent="setFilter('*')" :class="{ active: filter === '*' }">All</button>

            <!-- My bets page - Filter button -->
            <button class="btn" @click.prevent="setFilter('live')" :class="{ active: filter === 'live' }">Live</button>

            <!-- My bets page - Filter button -->
            <button class="btn" @click.prevent="setFilter('won')" :class="{ active: filter === 'won' }">Won</button>

            <!-- My bets page - Filter button -->
            <button class="btn" @click.prevent="setFilter('lose')" :class="{ active: filter === 'lose' }">Lose</button>
        </div>


        <!-- My bets page - List -->
        <div class="list" v-if="filterResult.length && !loading">
            <!-- My bets page - Bet -->
            <div class="bet" v-for="(bet, index) in filterResult" :key="index">
                <!-- My bets page - Live bet -->
                <div class="live" v-if="!bet.finished_round">
                    <!-- My bets page - Live bet - Head -->
                    <div class="head">
                        <!-- My bets page - Live bet - Round price -->
                        <div class="fixed_price">
                            <!-- My bets page - Live bet - Round price - Label -->
                            <div class="label">Round Price</div>

                            <!-- My bets page - Live bet - Round price - Value -->
                            <div class="val">
                                {{ calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                            </div>
                        </div>

                        <!-- My bets page - Live bet - VS icon -->
                        <img src="@/assets/ic_vs.svg" alt="" class="vs">

                        <!-- My bets page - Live bet - Current price -->
                        <div class="current_price">
                            <!-- My bets page - Live bet - Current price - Value -->
                            <div class="label">Live Price</div>

                            <!-- My bets page - Live bet - Current price - Label -->
                            <div class="val" :class="{
                                green: calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) <= calcCurrentPrice(),
                                red: calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) > calcCurrentPrice()
                            }">
                                {{ calcCurrentPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                            </div>
                        </div>
                    </div>

                    <!-- My bets page - Live bet - Image -->
                    <div class="image">
                        <img :src="bet.memePositive" alt="" v-if="bet.type === 'bull' && calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) <= calcCurrentPrice()">

                        <img :src="bet.memeNegative" alt="" v-if="bet.type === 'bull' && calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) > calcCurrentPrice()">

                        <img :src="bet.memeNegative" alt="" v-if="bet.type === 'bear' && calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) <= calcCurrentPrice()">

                        <img :src="bet.memePositive" alt="" v-if="bet.type === 'bear' && calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals) > calcCurrentPrice()">
                    </div>

                    <!-- My bets page - Live bet - Bottom -->
                    <div class="bottom">
                        <!-- My bets page - Live bet - Amount -->
                        <div class="amount">
                            <!-- My bets page - Live bet - Amount - Label -->
                            <div class="label">Your Вet:</div>

                            <!-- My bets page - Live bet - Amount - Value -->
                            <div class="val">
                                <!-- My bets page - Live bet - Amount - Direction -->
                                <img src="@/assets/ic_arrow_up.svg" alt="" v-if="bet.type === 'bull'">
                                <img src="@/assets/ic_arrow_down.svg" alt="" v-if="bet.type === 'bear'">

                                <!-- My bets page - Live bet - Amount - Value -->
                                {{ bet.amount }} Boom
                            </div>
                        </div>

                        <!-- My bets page - Live bet - Timer -->
                        <div class="timer">
                            <!-- My bets page - Live bet - Timer - Label -->
                            <div class="label">Round’s End:</div>

                            <!-- My bets page - Live bet - Timer - Value -->
                            <div class="val">
                                <vue-countdown :time="calcTimerTime(bet)" v-slot="{ minutes, seconds }">
                                    {{ minutes < 10 ? '0' + minutes : minutes }} : {{ seconds < 10 ? '0' + seconds : seconds }}
                                </vue-countdown>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- My bets page - Finished bet -->
                <div class="finished" v-else>
                    <!-- My bets page - Finished bet - Delete button -->
                    <!-- <button class="delete_btn" @click.prevent="deleteBet(bet.bet_id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M17.3957 7.81286C17.7295 7.47912 17.7295 6.93802 17.3957 6.60429C17.062 6.27055 16.5209 6.27055 16.1871 6.60429L12 10.7914L7.81286 6.60429C7.47912 6.27055 6.93802 6.27055 6.60429 6.60429C6.27055 6.93802 6.27055 7.47912 6.60429 7.81286L10.7914 12L6.60429 16.1871C6.27055 16.5209 6.27055 17.062 6.60429 17.3957C6.93802 17.7295 7.47912 17.7295 7.81286 17.3957L12 13.2086L16.1871 17.3957C16.5209 17.7295 17.062 17.7295 17.3957 17.3957C17.7295 17.062 17.7295 16.5209 17.3957 16.1871L13.2086 12L17.3957 7.81286Z" fill="currentColor"/>
                        </svg>
                    </button> -->

                    <!-- My bets page - Finished bet - Image -->
                    <div class="image">
                        <img :src="bet.memePositive" alt="">
                    </div>

                    <div class="center">
                        <!-- My bets page - Finished bet - Status -->
                        <div class="status">
                            <!-- My bets page - Finished bet - Status won -->
                            <span class="green" v-if="bet.finished_round.winner === bet.type">Won</span>

                            <!-- My bets page - Finished bet - Status lose -->
                            <span class="red" v-else>Lost</span>
                        </div>

                        <!-- My bets page - Finished bet - Prices -->
                        <div class="prices">
                            <!-- My bets page - Finished bet - Bet price -->
                            <div class="price bet">
                                <div class="label">Bet</div>

                                <div class="val" :class="{ green: bet.type === 'bull', red: bet.type === 'bear' }">
                                    {{ calcFinishedPrice(bet.finished_round.close_price, bet.roundInfo.live_round.decimals).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                                </div>
                            </div>

                            <div class="vs">Vs.</div>

                            <div class="price round">
                                <!-- My bets page - Finished bet - Round price -->
                                <div class="label">Round</div>

                                <div class="val">
                                    {{ calcFixedPrice(bet.roundInfo.live_round.open_price, bet.roundInfo.live_round.decimals).toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- My bets page - Finished bet - Image -->
                    <div class="image">
                        <img :src="bet.memeNegative" alt="">
                    </div>

                    <!-- My bets page - Finished bet - Prize -->
                    <div class="prize">
                        <!-- My bets page - Finished bet - Prize won -->
                        <span v-if="bet.finished_round.winner === bet.type">
                            {{ bet.prize.toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}
                        </span>

                        <!-- My bets page - Finished bet - Prize lose -->
                        <span v-else>-{{ bet.amount }}</span>

                        <!-- My bets page - Finished bet - Prize img -->
                        <img src="@/assets/boom_logo.svg" alt="">
                    </div>
                </div>
            </div>
        </div>

        <!-- My bets page - Empty list -->
        <div class="empty" v-else>You have no current bets.</div>

        <!-- My bets page - Claim rewards button -->
        <button class="claim_btn" @click.prevent="claimRewards()" v-if="isRewards">Claim Rewards</button>
    </section>

    <!-- Bottom panel -->
    <BottomPanel />
</template>


<script setup>
    import { ref, onBeforeMount, watch, computed } from 'vue'
    import { useGlobalStore } from '@/store'

    // Components
    import TopPanel from '@/components/TopPanel.vue'
    import BottomPanel from '@/components/BottomPanel.vue'


    const store = useGlobalStore(),
        isRewards = ref(0),
        filter = ref('*'),
        filterResult = ref([]),
        loading = ref(true)


    onBeforeMount(async () => {
        // Get bets
        store.bets.forEach(async bet => {
            // Gert finished round
            bet.finished_round = await store.getFinishedRound(bet.round_id).catch(error => null)

            // Set memes
            bet.memePositive = getPositiveMeme()
            bet.memeNegative = getNegativeMeme()
        })

        console.log(store.bets)

        // Filter bets
        filterResult.value = store.bets

        // Get rewards
        isRewards.value = parseInt((await store.myRewards()).pending_reward_total)

        // Hide loader
        loading.value = false
    })


    watch(computed(() => store.roundInfo.bidding_round.id), async () => {
        // Show loader
        loading.value = true

        // Update bets
        store.bets.forEach(async bet => {
            if (bet.round_id === bet.roundInfo.live_round.id) {
                bet.roundInfo.bidding_round.close_time = bet.roundInfo.live_round.close_time
            }

            bet.finished_round = await store.getFinishedRound(bet.roundInfo.bidding_round.id)
        })

        // Filter bets
        filterResult.value = store.bets

        // Update rewards
        isRewards.value = parseInt((await store.myRewards()).pending_reward_total)

        // Hide loader
        loading.value = false
    })


    // Filtering bets
    function setFilter(newValue) {
        // Set filter value
        filter.value = newValue

        // All bets
        if (filter.value === '*') {
            filterResult.value = store.bets
        }

        // Only live bets
        if (filter.value === 'live') {
            filterResult.value = store.bets.filter(bet => !bet.finished_round)
        }

        // All won bets
        if (filter.value === 'won') {
            filterResult.value = store.bets.filter(bet => bet.finished_round && bet.finished_round.winner === bet.type)
        }

        // All lose bets
        if (filter.value === 'lose') {
            filterResult.value = store.bets.filter(bet => bet.finished_round && bet.finished_round.winner !== bet.type)
        }
    }


    // Delete bet
    function deleteBet(bet_id) {
        // Delete bet
        store.deleteBet(bet_id)

        // Filter bets
        filterResult.value = store.bets
    }


    // Calc current price
    function calcCurrentPrice() {
        return store.priceInfo.price.price / Math.pow(10, store.priceInfo.decimals)
    }


    // Calc round price
    function calcFixedPrice(price, decimals) {
        return Number(price) / Math.pow(10, decimals)
    }


    // Calc timer time
    function calcTimerTime(bet) {
        return (Number(bet.roundInfo.bidding_round.close_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)
    }


    // Calc finished time
    function calcFinishedPrice(close_price, decimals) {
        return Number(close_price) / Math.pow(10, decimals)
    }


    // Claim rewards
    async function claimRewards() {
        // Claim rewards
        await store.claimRewards()

        // Update balances
        await store.loadBalances()

        // Rset rewards value
        isRewards.value = 0
    }


    // Get positive meme
    function getPositiveMeme() {
        let number = Math.floor(Math.random() * (process.env.MEME_POSITIVE_FILE_COUNT - 1 + 1)) + 1

        return require(`@/assets/meme/Positive/Positive_${number}.png`)
    }


    // Get negative meme
    function getNegativeMeme() {
        let number = Math.floor(Math.random() * (process.env.MEME_NEGATIVE_FILE_COUNT - 1 + 1)) + 1

        return require(`@/assets/meme/Negative/negative_${number}.png`)
    }
</script>


<style scoped>
.my_bets_page
{
    padding-top: 79px;
    padding-bottom: 62px;
}


.filter
{
    display: flex;
    overflow: hidden;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    width: calc(100% - 20px);
    margin: 0 10px 10px;

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
    color: #000e01;
    background: #fff200;
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

    pointer-events: none;
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

    width: 250px;
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
    width: 70px;
    height: 70px;

    border-radius: 6px;
}


.bet .finished .image img
{
    display: block;

    max-width: 100%;
    max-height: 100%;

    border-radius: inherit;

    object-fit: cover;
}


.bet .finished .center
{
    display: flex;
    align-self: center;
    flex-direction: column;

    width: calc(100% - 180px);

    gap: 4px;
}


.bet .finished .status
{
    font-size: 24px;
    font-weight: 600;

    padding: 4px 0;

    text-align: center;
}


.bet .finished .status .green
{
    color: #09ff00;
}

.bet .finished .status .red
{
    color: #f00;
}



.bet .finished .prices
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
}


.bet .finished .prices .vs
{
    font-size: 14px;
    font-weight: 600;
}


.bet .finished .price
{
    width: calc(50% - 14px);
}


.bet .finished .price.round
{
    text-align: right;
}


.bet .finished .price .label
{
    font-size: 14px;
    font-weight: 600;
}


.bet .finished .price .val
{
    font-size: 20px;
    font-weight: 600;
}


.bet .finished .price .val.green
{
    color: #09ff00;
}

.bet .finished .price .val.red
{
    color: #f00;
}


.bet .finished .prize
{
    font-size: 24px;
    font-weight: 600;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 100%;
    padding: 6px;

    color: #fff200;
    border-radius: 6px;
    background: #000e01;

    gap: 6px;
}


.bet .finished .prize img
{
    display: block;

    width: 28px;
    height: 28px;

    border-radius: 50%;
    background: #fff;
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