<template>
    <div class="create_account">
        <div class="title">Create account</div>

        <form @submit.prevent="onSubmit()" :class="{ disabled: isProcess }">
            <div class="line">
                <div class="label">Username</div>

                <div class="field">
                    <input type="text" class="input" placeholder="User name" v-model="username">
                </div>
            </div>

            <div class="line">
                <div class="label">Display name</div>

                <div class="field">
                    <input type="text" class="input" placeholder="Display name" v-model="display_name">
                </div>
            </div>

            <div class="submit">
                <button type="submit" class="submit_btn">Create</button>
            </div>
        </form>
    </div>
</template>


<script setup>
    import { ref, } from 'vue'
    import { useGlobalStore } from '@/store'

    const store = useGlobalStore(),
        username = ref(''),
        display_name = ref(''),
        isProcess = ref(false)


    async function onSubmit() {
        isProcess.value = true

        let result = await store.createUserAccount({
            username: username.value,
            display_name: display_name.value
        })

        if (!result) {
            isProcess.value = false
        }
    }
</script>


<style scoped>
.create_account
{
    padding: 20px;
}


.title
{
    font-size: 24px;
    font-weight: 600;

    margin-bottom: 40px;
}


.line
{
    margin-bottom: 20px;
}


.disabled
{
    pointer-events: none;

    opacity: .5;
}


.label
{
    font-weight: 500;

    margin-bottom: 8px;
}


.input::-webkit-input-placeholder
{
    color: rgba(255,255,255,.6);
}

.input:-moz-placeholder
{
    color: rgba(255,255,255,.6);
}

.input::-moz-placeholder
{
    opacity: 1;
    color: rgba(255,255,255,.6);
}

.input:-ms-input-placeholder
{
    color: rgba(255,255,255,.6);
}


.input,
.input:focus
{
    font-family: inherit;
    font-size: 16px;
    line-height: normal;

    display: block;

    width: 100%;
    height: 48px;
    padding: 0 15px;

    color: currentColor;
    border: 1px solid rgba(255,255,255,.3);
    border-radius: 12px;
    background: #001802;
}


.input:-webkit-autofill
{
    -webkit-box-shadow: inset 0 0 0 50px #001802 !important;
}



.submit
{
    padding-top: 20px;
}


.submit_btn
{
    font-size: 20px;
    font-weight: 900;

    display: block;

    width: 100%;
    height: 52px;

    color: #252849;
    border-radius: 6px;
    background: #fff;
}
</style>