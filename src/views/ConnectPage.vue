<template>
    <!-- Loader -->
    <Loader v-if="isProcess" />

    <!-- Main image -->
    <img src="@/assets/connect_page_img.png" alt="">

    <!-- Connection status -->
    <div class="conn_status">
        <span v-if="!store.isRTCConnected">Disconnect</span>
        <span v-else class="green">Connected</span>
    </div>

    <!-- Connect button -->
    <button class="btn" @click.prevent="connectWallet()" v-if="!store.isConnected">Connect Jet Wallet</button>

    <!-- <button class="btn" @click.prevent="faucet()" v-else :class="{ disabled: isFaucetProcess }">Get tokens</button> -->

    <!-- Version info -->
    <div class="version">
        {{ version }}
    </div>
</template>


<script setup>
    import { ref } from 'vue'
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'

    // Components
    import Loader from '@/components/Loader.vue'


    const store = useGlobalStore(),
        router = useRouter(),
        isProcess = ref(false),
        version = process.env.APP_VERSION || 'unknown'


    // Connect wallet
    async function connectWallet() {
        // Set process ststus
        isProcess.value = true

        // Connect wallet
        await store.connectWallet().then(async () => {
            try {
                // Check user account
                await store.checkUserAccount()

                if (store.isRegistered) {
                    // Redirect
                    router.push({ path: '/main' })
                }
            } catch(error) {
                if (store.isRegistered !== null && store.isRegistered === false) {
                    // Redirect
                    router.push({ path: '/register' })
                }
            }
		}).catch(error => {
            // Error request
			console.log(error)

            // alert(error)

            // Set process ststus
            isProcess.value = false
		})
    }
</script>


<style scoped>
    img
    {
        display: block;

        width: 100%;
        margin-top: -91px;

        pointer-events: none;
    }


    .conn_status
    {
        margin-top: auto;
        margin-bottom: 16px;

        text-align: center;

        color: rgba(255, 255, 255, .3);
    }


    .conn_status span
    {
        position: relative;

        display: inline-block;

        padding-left: 12px;

        vertical-align: top;
    }


    .conn_status span:before
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


    .conn_status span.green:before
    {
        background: #06c50e;
    }


    .btn
    {
        font-size: 18px;
        font-weight: 500;

        position: relative;
        z-index: 3;

        display: block;

        width: calc(100% - 40px);
        height: 52px;
        margin: 0 auto;

        border-radius: 12px;
        background: #950fff;
    }


    .btn.disabled
    {
        pointer-events: none;

        opacity: .5;
    }


    .version
    {
        font-size: 10px;

        margin-top: 40px;
        margin-bottom: 12px;

        text-align: center;

        opacity: .5;
    }
</style>