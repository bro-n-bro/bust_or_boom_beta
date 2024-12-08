<template>
    <div class="create_account">
        <div class="title">Registration</div>

        <form @submit.prevent="onSubmit()" :class="{ disabled: isProcess }">
            <div class="line">
                <div class="label">Enter your nickname:</div>

                <div class="field">
                    <input type="text" class="input" v-model="username" placeholder="Enter your nickname:"
                        @input="validateUsername()">
                </div>
            </div>

            <div class="line desc">
                Hello!<br>
                Enter your nickname. You will receive 100 Boom Coins as a new player. Good luck!
            </div>

            <div class="line img">
                <img src="@/assets/register_img.png" alt="">
            </div>

            <div class="submit">
                <button type="submit" class="submit_btn" :class="{ disabled: !isFormValid }">Register</button>
            </div>
        </form>
    </div>
</template>


<script setup>
    import { ref, inject } from 'vue'
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'


    const store = useGlobalStore(),
        router = useRouter(),
        emitter = inject('emitter'),
        username = ref(''),
        isFormValid = ref(false),
        isProcess = ref(false)


    function validateUsername() {
        let error = true

        if (!username.value.trim().length) {
            error = false
        }

        if (username.value.trim().includes(' ')) {
            error = false
        }

        isFormValid.value = error
    }


    async function onSubmit() {
        isProcess.value = true

        await store.faucet()

        let result = await store.createUserAccount({
            username: username.value,
            display_name: username.value
        })

        if (!result) {
            isProcess.value = false
        } else {
            await store.checkUserAccount()

            if (store.isRegistered) {
                emitter.emit('show_register_success_modal')

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



form
{
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
}


form.disabled
{
    pointer-events: none;

    opacity: .5;
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


form .desc
{
    padding: 0 10px;
}


form .img
{
    margin-top: auto;
}


form .img img
{
    display: block;

    width: 224px;
    max-width: 100%;
    margin: 0 auto;
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