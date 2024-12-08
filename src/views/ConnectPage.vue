<template>
    <div class="main">
        <img src="@/assets/connect_page_img.png" alt="">

        <button class="btn" @click.prevent="connectWallet()" v-if="!store.isConnected">Connect Jet Wallet</button>

        <!-- <button class="btn" @click.prevent="faucet()" v-else :class="{ disabled: isFaucetProcess }">Get tokens</button> -->

        <div class="version">
            {{ version }}
        </div>
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

            // Redirect
            // router.push({ path: '/register' })

            if (store.isRegistered !== null && store.isRegistered === false) {
                // Redirect
                router.push({ path: '/register' })
            }

            if (store.isRegistered) {
                // Redirect
                router.push({ path: '/main' })
            }
		}).catch(error => {
			console.log(error)
		})

        // store.connectWallet().then(() => {
        //     // Redirect
        //     router.push({ path: '/main' })
		// }).catch(error => {
        //     isFaucetProcess.value = false

		// 	console.log(error)
		// })
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