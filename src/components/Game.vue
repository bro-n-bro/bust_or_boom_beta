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
                <img src="@/assets/ic_arrow_up.svg" alt="" v-if="fixedPrice < calcCurrentPrice()">
                <img src="@/assets/ic_arrow_down.svg" alt="" v-if="fixedPrice > calcCurrentPrice()">

                <span>{{ calcCurrentPrice().toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>
        </div>


        <div class="data">
            <!-- <pre>{{ store.roundInfo }}</pre> -->

            <div class="fixed_price">
                Fixed Price: <span>{{ fixedPrice.toLocaleString('ru-RU', { maximumFractionDigits: 4 }).replace(',', '.') }}</span>
            </div>

            <div class="round_timer">
                Round:

                <vue-countdown :time="timerTime" v-slot="{ minutes, seconds }" :key="store.roundInfo.bidding_round.id">
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

            <!-- <pre>{{ store.roundInfo }}</pre> -->

            <div class="pool">
                <div class="label">Pool:</div>

                <img src="@/assets/ic_pool_BUST.svg" alt="">

                <div class="bar">
                    <img src="@/assets/ic_pool_bar_val.svg" alt="" class="val" :style="{ left: calcPoolPosition() + '%' }">
                </div>

                <img src="@/assets/ic_pool_BOOM.svg" alt="">
            </div>

            <div class="choice">
                <img src="@/assets/choice_img.jpg" alt="">

                <button class="bust btn" @click="createBustBet(calcBustPrize())" :class="{ disabled: isBetInRound() }">
                    <img src="@/assets/ic_BUST.svg" alt="">
                    <span>BUST</span>

                    <span class="prize">Prize: {{ calcBustPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Coins</span>
                </button>

                <button class="boom btn" @click="createBoomBet(calcBoomPrize())" :class="{ disabled: isBetInRound() }">
                    <span>BOOM</span>
                    <img src="@/assets/ic_BOOM.svg" alt="">

                    <span class="prize">Prize: {{ calcBoomPrize().toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }} Coins</span>
                </button>
            </div>
        </div>
    </div>


    <div class="fixed_panel">
        <router-link to="/main" class="link">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M21.1797 7.99975C21.1797 9.04661 21.1797 10.0935 21.1797 11.1769C18.8288 11.3807 16.7522 12.2383 14.9767 13.7359C14.2234 12.982 13.4848 12.2427 12.7002 11.4574C13.3003 11.0249 13.9048 10.5435 14.553 10.1307C16.4189 8.94142 18.4628 8.25179 20.6678 8.04286C20.7298 8.03701 20.7903 8.01436 20.8523 7.99902C20.9609 7.99975 21.0703 7.99975 21.1797 7.99975Z" fill="currentColor"/>
                <path d="M23.1484 8C23.8025 8.10812 24.4631 8.18702 25.1099 8.33093C27.4403 8.85034 29.4907 9.92496 31.2633 11.4795C30.5181 12.2232 29.7809 12.9596 29.0146 13.7252C27.2639 12.251 25.1916 11.3817 22.8203 11.18C22.8203 10.1105 22.8203 9.05563 22.8203 8.00073C22.9297 8 23.0391 8 23.1484 8Z" fill="currentColor"/>
                <path d="M36 21.1786C34.9529 21.1786 33.9059 21.1786 32.8223 21.1786C32.6182 18.8277 31.7614 16.7508 30.2637 14.9756C31.0184 14.2209 31.757 13.4816 32.5387 12.7007C32.9587 13.2793 33.4253 13.8615 33.8271 14.4854C35.0302 16.3541 35.7346 18.4025 35.9526 20.616C35.9607 20.6949 35.984 20.7724 36 20.8505C36 20.9594 36 21.069 36 21.1786Z" fill="currentColor"/>
                <path d="M35.9996 23.1473C35.9085 23.7208 35.8348 24.2972 35.7225 24.867C35.2653 27.1836 33.939 29.8033 32.5142 31.2526C31.7785 30.5155 31.042 29.7784 30.2764 29.0121C30.9713 28.1749 31.5816 27.2128 32.022 26.1477C32.4602 25.0884 32.7205 23.9867 32.8182 22.8193C33.8908 22.8193 34.9459 22.8193 36.0011 22.8193C35.9996 22.9282 35.9996 23.0378 35.9996 23.1473Z" fill="currentColor"/>
                <path d="M8 22.8188C9.04708 22.8188 10.0949 22.8188 11.1777 22.8188C11.3811 25.1704 12.2401 27.2466 13.7371 29.0218C12.9824 29.7765 12.2438 30.5158 11.4614 31.2982C11.0311 30.7035 10.5528 30.1074 10.1437 29.4667C8.95885 27.6097 8.2625 25.5766 8.0474 23.3814C8.03937 23.3025 8.01604 23.225 8 23.1469C8 23.038 8 22.9284 8 22.8188Z" fill="currentColor"/>
                <path d="M8 20.8508C8.10865 20.1977 8.1874 19.5381 8.33104 18.893C8.84073 16.6093 9.88125 14.5887 11.4089 12.8186C11.4439 12.7777 11.4665 12.7265 11.4745 12.7134C12.243 13.4819 12.9824 14.2212 13.7364 14.9751C12.2445 16.7474 11.3826 18.8148 11.1792 21.1788C10.1095 21.1788 9.05437 21.1788 8 21.1788C8 21.0693 8 20.9597 8 20.8508Z" fill="currentColor"/>
                <path d="M12.8066 21.9982C12.8066 16.9225 16.9242 12.8052 22 12.8052C27.0764 12.8052 31.1926 16.921 31.1933 21.9975C31.194 27.0726 27.0757 31.1913 22 31.1913C16.9257 31.192 12.8066 27.0726 12.8066 21.9982ZM22.8225 26.7153C22.9311 26.7102 23.0113 26.7044 23.0908 26.7029C24.6505 26.6686 25.8456 25.461 25.839 23.9269C25.8325 22.384 24.6118 21.1852 23.0376 21.1771C22.3631 21.1735 21.6886 21.1786 21.0141 21.1757C20.2996 21.172 19.803 20.7045 19.8081 20.0455C19.8132 19.4026 20.3047 18.9585 21.0207 18.9548C21.631 18.9519 22.2421 18.9592 22.8524 18.9526C23.4714 18.9461 23.9607 19.1747 24.3238 19.6876C24.6235 20.1113 25.104 20.1975 25.4949 19.9272C25.8748 19.6642 25.9499 19.1711 25.6677 18.7401C25.2251 18.0628 24.6053 17.6194 23.828 17.4119C23.5079 17.3265 23.171 17.3045 22.8225 17.2512C22.8225 17.1657 22.8225 17.0759 22.8225 16.986C22.8217 16.7216 22.8305 16.4571 22.8188 16.1934C22.7991 15.7492 22.4346 15.411 21.9941 15.4139C21.553 15.4168 21.1942 15.758 21.1804 16.2044C21.1695 16.5638 21.1782 16.9239 21.1782 17.2614C20.8493 17.2994 20.5642 17.306 20.2908 17.3674C18.9185 17.6764 18.0267 18.9592 18.174 20.3911C18.3111 21.7272 19.4982 22.7982 20.8741 22.8172C21.5851 22.8267 22.296 22.8164 23.007 22.8208C23.7011 22.8252 24.194 23.2964 24.1911 23.9451C24.1882 24.5917 23.6931 25.0526 22.9931 25.0548C22.3368 25.057 21.6806 25.0431 21.0243 25.0592C20.4498 25.0731 19.9809 24.8846 19.5923 24.4558C19.2671 24.0971 18.7508 24.0847 18.4183 24.3959C18.0843 24.7085 18.0668 25.2104 18.3877 25.5742C18.9265 26.1864 19.5988 26.5561 20.4126 26.6547C20.662 26.6846 20.9135 26.6985 21.1563 26.719C21.1658 26.7592 21.1738 26.7767 21.1738 26.7942C21.1753 27.104 21.1731 27.4137 21.1775 27.7235C21.1848 28.2253 21.5377 28.587 22.0087 28.5811C22.471 28.5753 22.8137 28.2202 22.821 27.7315C22.8268 27.4049 22.8225 27.0777 22.8225 26.7153Z" fill="currentColor"/>
                <path d="M14.969 30.2544C16.7584 31.7564 18.819 32.6126 21.1611 32.8164C21.1611 33.8757 21.1611 34.9189 21.1611 35.9613C19.1464 36.2448 14.4017 34.284 12.7334 32.4928C13.4728 31.752 14.2114 31.0127 14.969 30.2544Z" fill="currentColor"/>
                <path d="M22.8232 35.9999C22.8232 35.002 22.8232 34.0464 22.8232 33.0901C22.8232 33.0091 22.8232 32.928 22.8232 32.8206C23.9753 32.7168 25.0786 32.4648 26.1358 32.0265C27.1953 31.5874 28.1593 30.9906 29.0066 30.2754C29.7598 31.0286 30.5028 31.7715 31.2575 32.5262C28.8724 34.6016 26.0658 35.7749 22.8232 35.9999Z" fill="currentColor"/>
            </svg>
        </router-link>

        <router-link to="/my_bets" class="link">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.192 26.1512C29.972 21.8052 28.7448 17.4622 27.5059 13.1213C26.5774 9.86858 23.3683 8.01239 20.1023 8.8791C17.4389 9.58576 14.7945 10.367 12.1428 11.1182C10.0068 11.7226 8.64951 13.1337 7.94896 15.207C7.81601 15.5994 7.75903 16.0174 7.66699 16.4237V17.5177C7.73274 17.8283 7.78095 18.144 7.86642 18.4487C9.09658 22.8108 10.3224 27.1735 11.5679 31.5312C12.508 34.8212 15.8157 36.6818 19.0737 35.7676C21.7452 35.0185 24.4144 34.2629 27.0807 33.497C30.1751 32.6091 32.0605 29.2446 31.192 26.1512ZM16.6952 25.7514C16.6857 25.1142 16.4607 24.7283 15.8522 24.4821C15.0859 24.1715 14.6944 23.5452 14.6593 22.7033C14.6929 21.9221 15.0428 21.3324 15.7434 20.9685C16.0173 20.826 16.3117 20.7244 16.5849 20.5797C16.6791 20.53 16.7719 20.4174 16.8004 20.3159C16.8749 20.0535 16.9078 19.7809 16.9648 19.5142C17.1306 18.7447 17.5806 18.2229 18.3381 17.9978C19.0854 17.7757 19.7407 17.9642 20.2922 18.5094C20.4858 18.7016 20.6735 18.9018 20.8445 19.1145C20.9628 19.2613 21.0892 19.3008 21.2689 19.2708C21.5742 19.2204 21.8818 19.1744 22.19 19.1561C22.9556 19.1101 23.5612 19.4155 23.9651 20.0659C24.3698 20.7178 24.3574 21.3945 23.99 22.0632C23.8585 22.3029 23.7014 22.5287 23.5845 22.7742C23.5385 22.87 23.5334 23.0161 23.5714 23.1155C23.7233 23.5131 23.9659 23.8879 24.055 24.2972C24.3596 25.6922 23.1426 26.8608 21.7072 26.5875C21.3865 26.5268 21.0351 26.3514 20.7539 26.4303C20.4719 26.5085 20.2601 26.8381 20.0183 27.0581C19.4054 27.6164 18.7034 27.7969 17.9232 27.4914C17.143 27.186 16.7076 26.5838 16.6952 25.7514Z" fill="currentColor"/>
                <path d="M30.1947 8C30.4511 8.05115 30.7097 8.09646 30.9647 8.1542C33.7041 8.77536 35.6516 11.1753 35.6589 13.9859C35.6713 18.5335 35.6654 23.0819 35.6596 27.6303C35.6581 28.7974 35.3236 29.8738 34.6902 30.8545C34.3454 31.3888 33.7099 31.551 33.1912 31.2419C32.6631 30.9269 32.4892 30.2612 32.8304 29.7189C33.2979 28.9764 33.482 28.1762 33.4798 27.3044C33.4696 22.8839 33.4776 18.4634 33.4739 14.0429C33.4725 12.1903 32.2204 10.6367 30.4051 10.2764C29.9201 10.1799 29.4087 10.2179 28.9091 10.1865C28.4649 10.1587 28.1223 9.96362 27.9455 9.54049C27.768 9.11591 27.8184 8.70375 28.1304 8.36978C28.283 8.20608 28.519 8.12058 28.7177 8C29.2108 8 29.7031 8 30.1947 8Z" fill="currentColor"/>
                <path d="M21.7147 24.3486C20.5532 23.9576 19.6115 24.2229 18.8314 25.1678C18.8358 23.9729 18.3186 23.164 17.1914 22.7255C18.3383 22.3637 18.9483 21.6081 19.0293 20.3906C19.7481 21.3501 20.6503 21.7272 21.8337 21.3991C21.1142 22.363 21.0725 23.3291 21.7147 24.3486Z" fill="currentColor"/>
            </svg>
        </router-link>
    </div>
</template>


<script setup>
    import { ref, watch, computed, onBeforeMount } from 'vue'
    import { useGlobalStore } from '@/store'

    const store = useGlobalStore(),
        betAmount = ref(0),
        fixedPrice = ref(0),
        timerTime = ref(0)


    onBeforeMount(() => {
        betAmount.value = localStorage.getItem('betAmount') || 1

        fixedPrice.value = Number(String(store.roundInfo.live_round.open_price).slice(0, store.priceInfo.price.price.length)) / Math.pow(10, store.priceInfo.decimals)

        timerTime.value = (Number(store.roundInfo.bidding_round.open_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)
    })


    watch(computed(() => store.roundInfo.bidding_round.id), () => {
        timerTime.value = (Number(store.roundInfo.bidding_round.open_time) / 1e6 - Number(store.roundInfo.current_time) / 1e6)

        fixedPrice.value = Number(String(store.roundInfo.live_round.open_price).slice(0, store.priceInfo.price.price.length)) / Math.pow(10, store.priceInfo.decimals)
    })


    watch(computed(() => store.roundInfo.current_time), () => {
        calcPoolPosition()
    })


    function calcCurrentPrice() {
        return store.priceInfo.price.price / Math.pow(10, store.priceInfo.decimals)
    }


    function calcPoolPosition() {
        let bullAmount = Number(store.roundInfo.bidding_round.bull_amount),
            bearAmount = Number(store.roundInfo.bidding_round.bear_amount),
            sum = bullAmount + bearAmount,
            bull_lenght = bullAmount / sum,
            bear_lenght = bearAmount / sum

        return sum > 0 ? (bear_lenght / (bear_lenght + bull_lenght)) * 100 : 50
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


    async function createBustBet(prize) {
        await store.createBet({
            amount: betAmount.value,
            prize: prize,
            round_id: store.roundInfo.bidding_round.id,
            type: 'bear'
        })
    }


    async function createBoomBet(prize) {
        await store.createBet({
            amount: betAmount.value,
            prize: prize,
            round_id: store.roundInfo.bidding_round.id,
            type: 'bull'
        })
    }


    function isBetInRound() {
        return store.bets.find(bet => bet.round_id === store.roundInfo.bidding_round.id)
    }
</script>


<style scoped>
.game_page
{
    padding-bottom: 52px;
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
    z-index: 3;
    top: -3px;
    left: 50%;

    display: block;

    width: 12px;
    height: 14px;
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


.choice .btn.disabled
{
    pointer-events: none;

    opacity: .5;
}


</style>