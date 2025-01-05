<template>
    <!-- Top panel -->
    <div class="top_panel">
        <!-- Balance -->
        <div class="balance">
            <!-- Balance - Logo -->
            <div class="logo">
                <img src="@/assets/boom_logo.svg" alt="">
            </div>

            <div>
                <!-- Balance - Token -->
                <div class="label">BOOM</div>

                <!-- Balance - Value -->
                <div class="val">
                    {{ (store.balance.amount / Math.pow(10, store.exponent)).toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }}
                </div>
            </div>
        </div>

        <!-- User -->
        <div class="user">
            <div>
                <!-- User - Name -->
                <div class="name" :class="{ green: store.isRTCConnected }">
                    {{ store.user.display_name }}
                </div>

                <!-- User - Address -->
                <div class="address">
                    {{ store.getUserAddress().slice(0, 9) + '...' + store.getUserAddress().slice(-6) }}
                </div>
            </div>

            <!-- User - Avatar -->
            <div class="avatar">
                <img src="@/assets/JetWallet_logo.svg" alt="">
            </div>
        </div>
    </div>
</template>


<script setup>
    import { useGlobalStore } from '@/store'


    const store = useGlobalStore()
</script>


<style scoped>
    .top_panel
    {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        padding: 11px 10px;

        border-radius: 0 0 10px 10px;
        background: #001802;
    }


    .balance
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        gap: 8px;
    }


    .balance .logo
    {
        width: 38px;
        height: 38px;
        padding: 3px;

        border-radius: 50%;
        background: #fff;
    }


    .balance .logo img
    {
        display: block;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
    }


    .balance .label
    {
        font-size: 12px;
        font-weight: 500;
    }


    .balance .val
    {
        font-size: 14px;
        font-weight: 700;
    }



    .user
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


    .user .name
    {
        font-size: 12px;

        position: relative;

        display: inline-block;

        padding-left: 12px;

        vertical-align: top;
    }


    .user .name:before
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        display: block;

        width: 6px;
        height: 6px;
        margin: auto 0;

        content: '';

        border-radius: 50%;
        background: rgba(255, 255, 255, .3);
    }


    .user .name.green:before
    {
        background: #06c50e;
    }


    .user .address
    {
        font-size: 12px;
        font-weight: 100;
    }


    .user .avatar
    {
        width: 24px;
        height: 24px;

        border-radius: 50%;
        background: #000;
    }


    .user .avatar img
    {
        display: block;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
    }
</style>