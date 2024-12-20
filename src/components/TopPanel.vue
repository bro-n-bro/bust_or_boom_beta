<template>
    <div class="top_panel">
        <div class="balance">
            <div class="logo">
                <img src="@/assets/boom_logo.svg" alt="">
            </div>

            <div>
                <div class="label">Boom</div>

                <div class="val">
                    {{ (store.balance.amount / Math.pow(10, store.exponent)).toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(',', '.') }}
                </div>
            </div>
        </div>

        <div class="user">
            <div>
                <div class="name" :class="{ green: store.isRTCConnected }">
                    {{ store.user.display_name }}
                </div>

                <div class="address">
                    {{ store.getUserAddress().slice(0, 9) + '...' + store.getUserAddress().slice(-6) }}
                </div>
            </div>

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