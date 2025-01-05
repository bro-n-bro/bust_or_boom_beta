<template>
    <!-- Top panel -->
    <TopPanel />


    <!-- Game page -->
    <section class="game_page">
        <!-- Loader -->
        <Loader v-if="isProcess" />

        <!-- Current price -->
        <div class="current_price">
            <!-- Current price - Image -->
            <img src="@/assets/current_price_img.png" alt="">

            <!-- Current price - Label -->
            <div class="label">Live ATOM Price</div>

            <!-- Current price - Value -->
            <div class="val">
                <!-- Current price - Value direction -->
                <img src="@/assets/ic_arrow_up.svg" alt="" v-if="fixedPrice < calcCurrentPrice()">
                <img src="@/assets/ic_arrow_down.svg" alt="" v-if="fixedPrice > calcCurrentPrice()">

                <!-- Current price - Value -->
                <span>{{ calcCurrentPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>
        </div>

        <!-- <pre>{{ store.roundInfo }}</pre> -->

        <div class="data">
            <!-- Round price -->
            <div class="fixed_price">
                <!-- Round price - Chain logo -->
                <img src="@/assets/atom_logo.png" alt="">

                <!-- Round price - Label -->
                Round Price:

                <!-- Round price - Value -->
                <span>{{ fixedPrice.toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>

            <!-- Round timer -->
            <div class="round_timer">
                <!-- Round timer - Label -->
                Round:

                <!-- Round timer - Value -->
                <vue-countdown :time="timerTime" v-slot="{ minutes, seconds }" :key="store.roundInfo.bidding_round.id">
                    {{ minutes < 10 ? '0' + minutes : minutes }} : {{ seconds < 10 ? '0' + seconds : seconds }}
                </vue-countdown>
            </div>

            <!-- Pool -->
            <div class="pool">
                <!-- Pool - Label -->
                <div class="label">Pool:</div>

                <!-- Pool - Image -->
                <img src="@/assets/ic_pool_BUST.svg" alt="">

                <!-- Pool - Progressbar -->
                <div class="bar">
                    <!-- Pool - Value -->
                    <img src="@/assets/ic_pool_bar_val.svg" alt="" class="val" :style="{ left: calcPoolPosition() + '%' }">

                    <!-- Pool - Bust tokens area -->
                    <div class="bust_tokens" :style="{ width: calcPoolPosition() + '%' }">
                        <!-- Pool - Bust tokens value -->
                        <span>{{ (store.roundInfo.bidding_round.bear_amount / Math.pow(10, store.exponent)).toLocaleString('ru-RU', { maximumFractionDigits: 0 }).replace(',', '.') }}</span>
                    </div>

                    <!-- Pool - Boom tokens area -->
                    <div class="boom_tokens" :style="{ width: 'calc(100% - '+ calcPoolPosition() +'%)' }">
                        <!-- Pool - Boom tokens value -->
                        <span>{{ (store.roundInfo.bidding_round.bull_amount / Math.pow(10, store.exponent)).toLocaleString('ru-RU', { maximumFractionDigits: 0 }).replace(',', '.') }}</span>
                    </div>
                </div>

                <!-- Pool - Image -->
                <img src="@/assets/ic_pool_BOOM.svg" alt="">
            </div>
        </div>

        <div class="data">
            <!-- Bet amount -->
            <div class="bet">
                <!-- Bet amount - 1 Boom -->
                <button class="btn" @click.prevent="setBetAmount(1)" :class="{ active: betAmount == 1 }">1 Boom</button>

                <!-- Bet amount - 2 Boom -->
                <button class="btn" @click.prevent="setBetAmount(2)" :class="{ active: betAmount == 2 }">2 Boom</button>

                <!-- Bet amount - 3 Boom -->
                <button class="btn" @click.prevent="setBetAmount(3)" :class="{ active: betAmount == 3 }">3 Boom</button>
            </div>

            <!-- Choice -->
            <div class="choice">
                <!-- Choice - Image -->
                <img src="@/assets/choice_img.jpg" alt="">

                <!-- Choice - Bust button -->
                <button class="bust btn" @click="createBustBet(calcBustPrize())" :class="{ disabled: isBetInRound() }">
                    <!-- Choice - Bust button - Icon -->
                    <img src="@/assets/ic_BUST.svg" alt="">

                    <!-- Choice - Bust button - Label -->
                    <span>BUST</span>

                    <!-- Choice - Bust button - Prize -->
                    <span class="prize">Prize: {{ calcBustPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Boom</span>
                </button>

                <!-- Choice - Boom button -->
                <button class="boom btn" @click="createBoomBet(calcBoomPrize())" :class="{ disabled: isBetInRound() }">
                    <!-- Choice - Boom button - Label -->
                    <span>BOOM</span>

                    <!-- Choice - Boom button - Icon -->
                    <img src="@/assets/ic_BOOM.svg" alt="">

                    <!-- Choice - Boom button - Prize -->
                    <span class="prize">Prize: {{ calcBoomPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Boom</span>
                </button>
            </div>
        </div>
    </section>


    <!-- Bottom panel -->
    <BottomPanel />
</template>


<script setup>
    import { ref, watch, computed, onBeforeMount } from 'vue'
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'

    // Components
    import Loader from '@/components/Loader.vue'
    import TopPanel from '@/components/TopPanel.vue'
    import BottomPanel from '@/components/BottomPanel.vue'


    const store = useGlobalStore(),
        router = useRouter(),
        betAmount = ref(0),
        fixedPrice = ref(0),
        timerTime = ref(0),
        isProcess = ref(false)


    onBeforeMount(() => {
        // Set bet amount
        betAmount.value = localStorage.getItem('betAmount') || 1

        // Set round price
        fixedPrice.value = Number(store.roundInfo.live_round.open_price) / Math.pow(10, store.roundInfo.live_round.decimals)

        // Set timer time
        timerTime.value = (Number(store.roundInfo.bidding_round.open_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)
    })


    watch(computed(() => store.roundInfo.bidding_round.id), () => {
        // Update round price
        fixedPrice.value = Number(store.roundInfo.live_round.open_price) / Math.pow(10, store.roundInfo.live_round.decimals)

        // Update timer time
        timerTime.value = (Number(store.roundInfo.bidding_round.open_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)
    })


    watch(computed(() => store.roundInfo.current_time), () => {
        // Calc pool position
        calcPoolPosition()

        // Calc bust prize
        calcBustPrize()

        // Calc boom prize
        calcBoomPrize()
    })


    // Calc current price
    function calcCurrentPrice() {
        return Number(store.priceInfo.price.price) / Math.pow(10, store.priceInfo.decimals)
    }


    // Calc pool position
    function calcPoolPosition() {
        let bullAmount = Number(store.roundInfo.bidding_round.bull_amount),
            bearAmount = Number(store.roundInfo.bidding_round.bear_amount),
            sum = bullAmount + bearAmount,
            bull_lenght = bullAmount / sum,
            bear_lenght = bearAmount / sum

        return sum > 0 ? (bear_lenght / (bear_lenght + bull_lenght)) * 100 : 50
    }


    // Calc bust prize
    function calcBustPrize() {
        let bullAmount = Number(store.roundInfo.bidding_round.bull_amount) / Math.pow(10, store.exponent),
            bearAmount = Number(store.roundInfo.bidding_round.bear_amount) / Math.pow(10, store.exponent),
            result = 0

        if (bullAmount > 0) {
            result = Number(betAmount.value) / (bearAmount + Number(betAmount.value)) * bullAmount * 0.99
        }

        return result
    }


    // Calc boom prize
    function calcBoomPrize() {
        let bullAmount = Number(store.roundInfo.bidding_round.bull_amount) / Math.pow(10, store.exponent),
            bearAmount = Number(store.roundInfo.bidding_round.bear_amount) / Math.pow(10, store.exponent),
            result = 0

        if (bearAmount > 0) {
            result = Number(betAmount.value) / (bullAmount + Number(betAmount.value)) * bearAmount * 0.99
        }

        return result
    }


    // Set bet amount
    function setBetAmount(value) {
        // Set value
        betAmount.value = value

        // Save in localStorage
        localStorage.setItem('betAmount', value)
    }


    // Create bust bet
    async function createBustBet(prize) {
        // Set process ststus
        isProcess.value = true

        // Create bet
        await store.createBet({
            amount: betAmount.value,
            prize: prize,
            round_id: store.roundInfo.bidding_round.id,
            type: 'bear'
        }).then(() => {
            // Redirect
            router.push({ path: '/my_bets' })
        }).catch(error => {
            // Error
			console.log(error)

            // Set process ststus
            isProcess.value = false
		})
    }


    // Create boom bet
    async function createBoomBet(prize) {
        // Set process ststus
        isProcess.value = true

        // Create bet
        await store.createBet({
            amount: betAmount.value,
            prize: prize,
            round_id: store.roundInfo.bidding_round.id,
            type: 'bull'
        }).then(() => {
            // Redirect
            router.push({ path: '/my_bets' })
        }).catch(error => {
            // Error
			console.log(error)

            // Set process ststus
            isProcess.value = false
		})
    }


    // Check for bet in current round
    function isBetInRound() {
        return store.bets.find(bet => bet.round_id === store.roundInfo.bidding_round.id)
    }
</script>


<style scoped>
    .game_page
    {
        padding-top: 79px;
        padding-bottom: 62px;
    }


    .current_price
    {
        position: relative;

        width: calc(100% - 20px);
        margin: 0 10px 10px;
        padding: 8px;

        text-align: right;

        border-radius: 12px;
        background: #001802;
    }


    .current_price > img
    {
        position: absolute;
        top: 0;
        left: 18px;

        display: block;

        height: 100%;

        pointer-events: none;
    }


    .current_price .label
    {
        font-weight: 600;
    }


    .current_price .val
    {
        font-size: 32px;
        font-weight: 700;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
    }


    .current_price .val img
    {
        display: block;

        width: 34px;
        height: 34px;
    }



    .data
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: calc(100% - 20px);
        margin: 0 10px 10px;
        padding: 10px;

        border-radius: 12px;
        background: #001802;
    }



    .fixed_price
    {
        font-weight: 500;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        gap: 4px;
    }


    .fixed_price img
    {
        display: block;

        width: 24px;
        height: 24px;

        border-radius: 50%;
    }


    .fixed_price span
    {
        font-size: 20px;
        font-weight: 900;

        color: #fff200;
    }


    .round_timer
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        gap: 4px;
    }


    .round_timer span
    {
        font-size: 20px;
        font-weight: 900;

        color: #fff200;
    }



    .pool
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        margin-top: 8px;
    }


    .pool .label
    {
        font-weight: 500;

        width: 100%;
    }


    .pool > img
    {
        display: block;

        width: 24px;
        height: 24px;
    }


    .pool .bar
    {
        position: relative;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;

        width: calc(100% - 70px);

        border-radius: 3px;
        box-shadow: 0 0 0 2px #000e01;
    }


    .pool .bar .bust_tokens
    {
        font-size: 14px;
        font-weight: 900;

        position: relative;

        height: 17px;

        transition: width .2s linear;
        white-space: nowrap;

        border: 1px solid #f80000;
        border-radius: 3px 0 0 3px;
        background: linear-gradient(135deg,  rgba(255,35,35,1) 0%,rgba(248,0,0,1) 100%);
    }


    .pool .bar .bust_tokens span
    {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        height: 100%;
        padding: 0 5px;
    }


    .pool .bar .boom_tokens
    {
        font-size: 14px;
        font-weight: 900;

        position: relative;

        height: 17px;

        transition: width .2s linear;
        white-space: nowrap;

        border: 1px solid #06b000;
        border-radius: 0 3px 3px 0;
        background: linear-gradient(135deg,  rgba(58,219,0,1) 0%,rgba(6,176,0,1) 100%);
    }

    .pool .bar .boom_tokens span
    {
        position: absolute;
        top: 0;
        right: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;

        height: 100%;
        padding: 0 5px;
    }


    .pool .bar .val
    {
        position: absolute;
        z-index: 3;
        top: -4px;
        left: 50%;

        display: block;

        width: 20px;
        height: 25px;
        margin-left: -4px;

        transition: left .2s linear;
    }



    .bet
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: flex-start;

        width: 100%;
        margin-bottom: 8px;

        gap: 4px;
    }


    .bet .btn
    {
        font-size: 20px;
        font-weight: 900;

        display: block;

        width: 100%;
        height: 38px;

        transition: .2s linear;

        border-radius: 6px;
        background: #252849;
    }


    .btn.active
    {
        color: #252849;
        background: #fff;
    }



    .choice
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        gap: 8px;
    }


    .choice > img
    {
        display: block;

        width: 100%;

        border-radius: 6px;
    }


    .choice .btn
    {
        font-size: 20px;
        font-weight: 800;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: calc(50% - 4px);
        height: 54px;

        border-radius: 6px;

        gap: 0 2px;
    }


    .choice .btn img
    {
        position: relative;
        top: 1px;

        display: block;

        width: 14px;
        height: 15px;
    }


    .choice .btn .prize
    {
        font-size: 16px;
        font-weight: 400;

        display: block;

        width: 100%;
        margin-top: -2px;
    }


    .choice .btn.bust
    {
        background: #ff3232;
    }

    .choice .btn.boom
    {
        background: #1a9a00;
    }


    .choice .btn.disabled
    {
        pointer-events: none;

        opacity: .6;
    }
</style>