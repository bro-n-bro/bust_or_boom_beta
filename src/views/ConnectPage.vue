<template>
    <img src="@/assets/connect_page_img.png" alt="">

    <div class="conn_status">
        <span v-if="!store.isRTCConnected()">Disconnect</span>
        <span v-else class="green">Connected</span>
    </div>

    <button class="btn" @click.prevent="connectWallet()" v-if="!store.isConnected">Connect Jet Wallet</button>

    <!-- <button class="btn" @click.prevent="faucet()" v-else :class="{ disabled: isFaucetProcess }">Get tokens</button> -->

    <div class="version">
        {{ version }}
    </div>
</template>


<script setup>
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'


    const store = useGlobalStore(),
        router = useRouter(),
        version = process.env.APP_VERSION || 'unknown'


    async function connectWallet() {
        await store.connectWallet().then(async () => {
            await store.checkUserAccount()

            // router.push({ path: '/register' })

            if (store.isRegistered !== null && store.isRegistered === false) {
                router.push({ path: '/register' })
            }

            if (store.isRegistered) {
                router.push({ path: '/main' })
            }
		}).catch(error => {
			console.log(error)
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
    margin-bottom: 10px;

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
    margin: auto auto 0;

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