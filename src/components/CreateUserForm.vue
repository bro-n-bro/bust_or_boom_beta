<template>
    <!-- Create account -->
    <div class="create_account">
        <!-- Loader -->
        <Loader v-if="isProcess" />

        <template v-if="step === 1">
        <!-- Registration - Title -->
        <div class="title">Registration</div>

        <!-- Registration - Form -->
        <form @submit.prevent="onSubmit()">
            <!-- Registration - Field -->
            <div class="line">
                <!-- Registration - Field label -->
                <div class="label">Enter your nickname:</div>

                <div class="field">
                    <!-- Registration - Input -->
                    <input type="text" class="input" v-model="username" placeholder="Enter your nickname:"
                        @input="validateUsername()">
                </div>
            </div>

            <!-- Registration - Description -->
            <div class="line desc">
                Hello!<br>
                Enter your nickname. You will receive 100 Boom Coins as a new player. Good luck!
            </div>

            <!-- Registration - Image -->
            <div class="line img">
                <img src="@/assets/register_img.png" alt="">
            </div>

            <div class="submit">
                <!-- Registration - Submit button -->
                <button type="submit" class="submit_btn" :class="{ disabled: !isFormValid }">Next</button>
            </div>
        </form>
        </template>


        <template v-if="step === 2">
        <!-- 1-Click Activation - Title -->
        <div class="title">1-Click Activation</div>

        <!-- 1-Click Activation - Description -->
        <div class="desc">You also can turn on 1-Click transactions at the beginning to give Jet Wallet access.</div>

        <!-- 1-Click Activation - Image -->
        <div class="img">
            <img src="@/assets/register_img.png" alt="" class="small">
        </div>

        <div class="btns">
            <!-- 1-Click Activation - Registration with 1-Click button -->
            <button class="btn" @click.prevent="registerWith1Click()">
                <img src="@/assets/bg_with_1_click_btn.png" alt="">
                <span>Registration with 1-Click</span>
                <img src="@/assets/bg_with_1_click_btn2.png" alt="">
            </button>

            <!-- 1-Click Activation - Register button -->
            <button class="btn dark" @click.prevent="register()">Registration</button>
        </div>
        </template>
    </div>
</template>


<script setup>
    import { ref, inject } from 'vue'
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'

    // Components
    import Loader from '@/components/Loader.vue'


    const store = useGlobalStore(),
        router = useRouter(),
        emitter = inject('emitter'),
        step = ref(1),
        username = ref(''),
        isFormValid = ref(false),
        isProcess = ref(false)


    // Validate username
    function validateUsername() {
        let error = true

        // Validation length
        if (!username.value.trim().length) {
            error = false
        }

        // ValidaValidationte spaces
        if (username.value.trim().includes(' ')) {
            error = false
        }

        // Validation result
        isFormValid.value = error
    }


    // Submit form
    async function onSubmit() {
        // Move to second step
        step.value = 2
    }


    // Register
    async function register() {
        // Set process status
        isProcess.value = true

        // Get faucet
        await store.faucet()

        // Create user account
        let result = await store.createUserAccount({
            username: username.value,
            display_name: username.value
        })

        if (!result) {
            // Set process status
            isProcess.value = false
        } else {
            // Check user account
            await store.checkUserAccount()

            if (store.isRegistered) {
                // Event "show_register_success_modal"
                emitter.emit('show_register_success_modal')

                // Redirect
                router.push({ path: '/main' })
            }
        }
    }


    // Register with 1-Click
    async function registerWith1Click() {
        // Set process status
        isProcess.value = true

        // Get faucet
        await store.faucet()

        // Create user account
        let result = await store.createUserAccount({
            username: username.value,
            display_name: username.value
        })

        if (!result) {
            // Set process status
            isProcess.value = false
        } else {
            // Enable 1-Click
            await store.enable1CLick().catch(error => {
                // Error
                console.log(error)
            })

            // Check user account
            await store.checkUserAccount()

            // Get grants
            await store.getGrants()

            if (store.isRegistered) {
                // Event "show_register_success_modal"
                emitter.emit('show_register_success_modal')

                // Redirect
                router.push({ path: '/main' })
            }
        }
    }
</script>


<style scoped>
    .create_account
    {
        display: flex;
        flex: 1 0 auto;
        flex-direction: column;

        padding: 10px 10px 20px;
    }


    .title
    {
        font-size: 22px;
        font-weight: 500;

        margin-bottom: 20px;
        padding: 0 10px;
    }


    .desc
    {
        padding: 0 10px;
    }


    .img
    {
        margin-top: auto;
    }


    .img img
    {
        display: block;

        width: 224px;
        max-width: 100%;
        margin: 0 auto;
    }


    .img img.small
    {
        width: 192px;
    }


    .btns
    {
        display: flex;
        flex-direction: column;

        padding: 48px 10px 0;

        gap: 10px;
    }


    .btns .btn
    {
        font-size: 18px;
        font-weight: 500;

        position: relative;

        display: block;
        overflow: hidden;

        width: 100%;
        height: 52px;

        transition: opacity .2s linear;

        color: #fff;
        border-radius: 12px;
        background: linear-gradient(112deg, #ab40ff 1.84%, #7800d6 89.88%);
    }


    .btns .btn.dark
    {
        background: #001802;
    }


    .btns .btn img
    {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;

        display: block;

        width: 62.5px;

        pointer-events: none;
    }


    .btns .btn img ~ img
    {
        top: auto;
        right: 0;
        bottom: 0;
        left: auto;
    }


    .btns .btn span
    {
        position: relative;
        z-index: 3;
    }



    form
    {
        display: flex;
        flex: 1 0 auto;
        flex-direction: column;
    }


    form .line
    {
        margin-bottom: 17px;
    }


    form .label
    {
        font-size: 14px;

        margin-bottom: 4px;
        padding: 0 10px;
    }


    form .input::-webkit-input-placeholder
    {
        color: rgba(255,255,255,.6);
    }

    form .input:-moz-placeholder
    {
        color: rgba(255,255,255,.6);
    }

    form .input::-moz-placeholder
    {
        opacity: 1;
        color: rgba(255,255,255,.6);
    }

    form .input:-ms-input-placeholder
    {
        color: rgba(255,255,255,.6);
    }


    form .input,
    form .input:focus
    {
        font-family: inherit;
        font-size: 16px;
        font-weight: 500;

        display: block;

        width: 100%;
        height: 48px;
        padding: 0 15px;

        color: currentColor;
        border: 1px solid transparent;
        border-radius: 10px;
        background: #001802;
    }


    form .input:-webkit-autofill
    {
        -webkit-box-shadow: inset 0 0 0 50px #001802 !important;
    }


    form .submit
    {
        margin-top: auto;
        padding-top: 20px;
    }


    form .submit_btn
    {
        font-size: 18px;
        font-weight: 500;

        display: block;

        width: 100%;
        height: 52px;

        transition: opacity .2s linear;

        color: #fff;
        border-radius: 12px;
        background: #950fff;
    }


    form .submit_btn.disabled
    {
        pointer-events: none;

        opacity: .6;
    }
</style>