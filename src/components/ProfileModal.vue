<template>
    <!-- Profile modal -->
    <section class="modal">
        <div class="modal_content">
            <!-- Profile modal data -->
            <div class="data">
                <!-- Modal close button -->
                <button class="close_btn" @click.prevent="emitter.emit('close_profile_modal')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.296 7.115C18.6853 6.72564 18.6853 6.09436 18.296 5.705C17.9066 5.31564 17.2753 5.31564 16.886 5.705L12.001 10.59L7.11598 5.705C6.72662 5.31564 6.09534 5.31564 5.70598 5.705C5.31662 6.09436 5.31662 6.72564 5.70598 7.115L10.591 12L5.70598 16.885C5.31662 17.2744 5.31662 17.9056 5.70598 18.295C6.09534 18.6844 6.72662 18.6844 7.11598 18.295L12.001 13.41L16.886 18.295C17.2753 18.6844 17.9066 18.6844 18.296 18.295C18.6853 17.9056 18.6853 17.2744 18.296 16.885L13.411 12L18.296 7.115Z" fill="currentColor"/>
                    </svg>
                </button>

                <!-- Loader -->
                <Loader v-if="isProcess" />

                <!-- Modal title -->
                <div class="modal_title">Profile</div>

                <!-- Profile modal info -->
                <div class="info">
                    <!-- Profile modal name -->
                    <div>
                        <div class="label">Name:</div>

                        <div class="val">
                            {{ store.user.display_name }}

                        </div>
                    </div>

                    <!-- Profile modal address -->
                    <div>
                        <div class="label">Address:</div>

                        <div class="val">
                            {{ store.getUserAddress().slice(0, 16) + '...' + store.getUserAddress().slice(-16) }}
                        </div>
                    </div>
                </div>

                <!-- Profile modal 1Click -->
                <div class="info_1_click">
                    <div class="label">1-Click:</div>

                    <div class="bg">
                        <div>
                            <div class="status">
                                <span v-if="newStatus">On</span>
                                <span v-else>Off</span>
                            </div>

                            <div class="toggle" :class="{ active: newStatus }" @click.prevent="newStatus = !newStatus">
                                <div class="ball"></div>
                            </div>
                        </div>

                        <div class="period">
                            <div class="label">Session period</div>

                            <div class="val">7 Days</div>
                        </div>
                    </div>
                </div>

                <!-- Profile modal buttons -->
                <div class="btns">
                    <!-- Close button -->
                    <button class="btn" @click.prevent="emitter.emit('close_profile_modal')" v-if="!isStatusChanged">
                        <span>OK</span>
                    </button>

                    <!-- Enable 1-Click button -->
                    <button class="btn" @click.prevent="enable1CLick()" v-if="isStatusChanged && newStatus">
                        <span>Enable 1-Click Transactions</span>
                    </button>

                    <!-- Disable 1-Click button -->
                    <button class="btn" @click.prevent="disable1CLick()" v-if="isStatusChanged && !newStatus">
                        <span>Disable 1-Click Transactions</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup>
    import { ref, inject, computed } from 'vue'
    import { useGlobalStore } from '@/store'

    // Components
    import Loader from '@/components/Loader.vue'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        newStatus = ref(store.isGranted),
        isStatusChanged = computed(() => newStatus.value !== store.isGranted),
        isProcess = ref(false)


    // Enable 1-Click
    async function enable1CLick() {
        // Set process ststus
        isProcess.value = true

        // Enable 1-Click
        await store.enable1CLick().then(async () => {
            // Close profile modal
            emitter.emit('close_profile_modal')

            // Get grants
            await store.getGrants()
        }).catch(error => {
            // Error
			console.log(error)

            // Set process ststus
            isProcess.value = false
		})
    }


    // Disable 1-Click
    async function disable1CLick() {
        // Set process ststus
        isProcess.value = true

        // Create bet
        await store.disable1CLick().then(() => {
            // Close profile modal
            emitter.emit('close_profile_modal')
        }).catch(error => {
            // Error
            console.log(error)

            // Set process ststus
            isProcess.value = false
        })
    }
</script>


<style scoped>
    .info
    {
        display: flex;
        flex-direction: column;

        padding: 10px 4px;

        border-radius: 10px;
        background: #004806;

        gap: 10px;
    }


    .info > *
    {
        display: flex;
        flex-direction: column;

        padding: 0 10px;

        gap: 4px;
    }


    .info .label
    {
        font-size: 14px;
    }


    .info .val
    {
        font-size: 16px;
        font-weight: 500;

        padding-left: 6px;
    }



    .info_1_click
    {
        margin-top: 10px;
    }


    .info_1_click .label
    {
        font-size: 14px;

        padding: 0 10px;
    }


    .info_1_click .bg
    {
        padding: 4px 8px;

        border-radius: 10px;
        background: #001802;
    }


    .info_1_click .bg > *
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        padding: 14px 8px;
    }


    .info_1_click .bg > * + *
    {
        border-top: 1px solid rgba(255, 255, 255, .20);
    }


    .info_1_click .status
    {
        font-size: 16px;
        font-weight: 500;
    }


    .info_1_click .toggle
    {
        position: relative;

        width: 48px;
        height: 24px;

        cursor: pointer;

        border-radius: 16px;
        background: #000e01;
    }


    .info_1_click .toggle .ball
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 3px;

        width: 18px;
        height: 18px;
        margin: auto 0;

        transition: .2s linear;

        border-radius: 50%;
        background: #252849;
    }


    .info_1_click .toggle.active .ball
    {
        left: 27px;

        background: #fff200;
    }


    .info_1_click .period
    {
        font-size: 16px;

        opacity: .5;
    }


    .info_1_click .period .label
    {
        font-size: inherit;

        padding: 0;
    }



    .btns
    {
        padding-top: 67px;
    }
</style>