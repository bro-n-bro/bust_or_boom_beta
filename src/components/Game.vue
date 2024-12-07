<template>
    <div class="game_page">
        <div class="head">
            <div class="balance">
                <div class="logo">

                </div>

                <div>
                    <div class="label">BetCoin</div>

                    <div class="val">
                        {{ (store.balance.amount / Math.pow(10, store.exponent)).toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }}

                        {{ store.symbol }}
                    </div>
                </div>
            </div>

            <div class="user">
                <div>
                    <div class="name">
                        {{ store.user.display_name }}
                    </div>

                    <div class="address">
                        {{ store.getUserAddress().slice(0, 9) + '...' + store.getUserAddress().slice(-6) }}
                    </div>
                </div>

                <div class="avatar">

                </div>
            </div>
        </div>


        <div class="current_price">
            <img src="@/assets/current_price_img.png" alt="">

            <div class="label">Current Price</div>

            <div class="val">
                <img src="@/assets/ic_arrow_up.svg" alt="" v-if="calcFixedPrice() < calcCurrentPrice()">
                <img src="@/assets/ic_arrow_down.svg" alt="" v-if="calcFixedPrice() > calcCurrentPrice()">

                <span>{{ calcCurrentPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>
        </div>


        <div class="data">
            <div class="fixed_price">
                Fixed Price: <span>{{ calcFixedPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>

            <div class="round_timer">
                Round:

                {{ store.roundInfo.bidding_round.id }}

                <vue-countdown :time="calcRoundTime()" v-slot="{ minutes, seconds }" :key="store.roundInfo.bidding_round.id">
                    {{ minutes < 10 ? '0' + minutes : minutes }} : {{ seconds < 10 ? '0' + seconds : seconds }}
                </vue-countdown>
            </div>

            <div class="bet">
                <div class="val">Bet: <span>{{ betAmount }}</span></div>

                <div class="btns">
                    <button class="btn" @click.prevent="setBetAmount(1)" :class="{ active: betAmount == 1 }">1 Coin</button>

                    <button class="btn" @click.prevent="setBetAmount(2)" :class="{ active: betAmount == 2 }">2 Coin</button>

                    <button class="btn" @click.prevent="setBetAmount(3)" :class="{ active: betAmount == 3 }">3 Coin</button>
                </div>
            </div>

            <div class="pool">
                <div class="label">Pool:</div>

                <img src="@/assets/ic_pool_BUST.svg" alt="">

                <div class="bar">
                    <img src="@/assets/ic_pool_bar_val.svg" alt="" class="val" :style="{ left: calcPollPosition() + '%' }">
                </div>

                <img src="@/assets/ic_pool_BOOM.svg" alt="">
            </div>

            <div class="choice">
                <img src="@/assets/choice_img.jpg" alt="">

                <button class="bust btn">
                    <img src="@/assets/ic_BUST.svg" alt="">
                    <span>BUST</span>

                    <span class="prize">Prize: {{ calcBustPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Coins</span>
                </button>

                <button class="boom btn">
                    <span>BOOM</span>
                    <img src="@/assets/ic_BOOM.svg" alt="">

                    <span class="prize">Prize: {{ calcBoomPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Coins</span>
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { ref } from 'vue'
    import { useGlobalStore } from '@/store'

    const store = useGlobalStore(),
        betAmount = ref(localStorage.getItem('betAmount') || 1)


    function calcCurrentPrice() {
        return store.priceInfo.price.price / Math.pow(10, store.priceInfo.decimals)
    }


    function calcFixedPrice() {
        return String(store.roundInfo.live_round.open_price).slice(0, store.priceInfo.price.price.length) / Math.pow(10, store.priceInfo.decimals)
    }


    function calcRoundTime() {
        return parseInt((Number(store.roundInfo.bidding_round.open_time) / 1e6)) - Date.now()
    }


    function calcPollPosition() {
        let bullAmount = store.roundInfo.bidding_round.bull_amount > 0 || 1,
            bearAmount = store.roundInfo.bidding_round.bear_amount > 0 || 1,
            sum = bullAmount + bearAmount,
            bull_lenght = bearAmount / sum,
            bear_lenght = bearAmount / sum

        return (bear_lenght / (bear_lenght + bull_lenght)) * 100
    }


    function calcBustPrize() {
        let bullAmount = store.roundInfo.bidding_round.bull_amount > 0 || 1,
            bearAmount = store.roundInfo.bidding_round.bear_amount > 0 || 1

        return betAmount.value/bullAmount * bearAmount * 0.99
    }


    function calcBoomPrize() {
        let bullAmount = store.roundInfo.bidding_round.bull_amount > 0 || 1,
            bearAmount = store.roundInfo.bidding_round.bear_amount > 0 || 1

        return betAmount.value/bearAmount * bullAmount * 0.99
    }


    function setBetAmount(value) {
        betAmount.value = value

        localStorage.setItem('betAmount', value)
    }
</script>


<style scoped>
.head
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-bottom: 6px;
    padding: 6px 10px;

    border-radius: 0 0 10px 10px;
    background: #001802;
}


.head .balance
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    gap: 8px;
}


.head .balance .logo
{
    width: 38px;
    height: 38px;
    padding: 3px;

    border-radius: 50%;
    background: #000;
}


.head .balance .logo img
{
    display: block;

    width: 100%;
    height: 100%;

    border-radius: 50%;

    object-fit: cover;
}


.head .balance .label
{
    font-size: 12px;
    font-weight: 500;
}


.head .balance .val
{
    font-size: 14px;
    font-weight: 700;
}


.head .user
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    padding: 6px 8px;

    text-align: right;

    border-radius: 6px;
    background: #000e01;

    gap: 6px;
}


.head .user .name
{
    font-size: 12px;
}


.head .user .address
{
    font-size: 12px;
    font-weight: 100;
}


.head .user .avatar
{
    width: 24px;
    height: 24px;

    border-radius: 50%;
    background: #d9d9d9;
}


.head .user .avatar img
{
    display: block;

    width: 100%;
    height: 100%;

    border-radius: 50%;

    object-fit: cover;
}



.current_price
{
    position: relative;

    width: calc(100% - 20px);
    margin: 0 10px 6px;
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
    margin: 0 10px 6px;
    padding: 10px;

    border-radius: 12px;
    background: #001802;
}


.data .fixed_price
{
    font-weight: 500;
}


.data .fixed_price
{
    font-weight: 500;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    gap: 4px;
}


.data .fixed_price span
{
    font-size: 20px;
    font-weight: 900;

    color: #fff200;
}


.data .round_timer
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    gap: 4px;
}


.data .round_timer span
{
    font-size: 20px;
    font-weight: 900;

    color: #fff200;
}



.bet
{
    width: 100%;
    margin-top: 6px;
}


.bet .val
{
    font-size: 20px;
    font-weight: 600;

    width: 100%;
}


.bet .val span
{
    font-weight: 900;

    color: #fff200;
}


.bet .btns
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    margin-top: 6px;

    gap: 4px;
}


.bet .btn
{
    font-size: 20px;
    font-weight: 900;

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



.pool
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    width: 100%;
    margin-top: 10px;
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

    width: calc(100% - 66px);
    height: 14px;

    border-radius: 10px;
    background: linear-gradient(90deg, #b30404 0%, #c83c00 25%, #ff6b00 53%, #ffc700 77%, #61ff00 100%);
}


.pool .bar .val
{
    position: absolute;
    top: -3px;
    left: 50%;

    display: block;

    width: 12px;
    height: 14px;
    z-index: 3;
    margin-left: -6px;

    transition: transform .2s linear;
}


.choice
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-top: 8px;

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

    border: 3px solid transparent;
    border-radius: 6px;

    gap: 2px;
}


.choice .btn img
{
    position: relative;
    top: 1px;

    display: block;

    width: 13px;
    height: 14px;
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
    border-color: #c1ffbf;
    background: #1a9a00;
}






</style>