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

                <!-- Profile modal buttons -->
                <div class="btns">
                    <!-- Close button -->
                    <button class="btn" @click.prevent="emitter.emit('close_profile_modal')">
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup>
    import { inject } from 'vue'
    import { useGlobalStore } from '@/store'


    const store = useGlobalStore(),
        emitter = inject('emitter')
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



.btns
{
    padding-top: 67px;
}



</style>