<template>
    <!-- Register success modal -->
    <section class="modal">
        <div class="modal_content">
            <!-- Register success modal data -->
            <div class="data">
                <!-- Modal close button -->
                <button class="close_btn" @click.prevent="emitter.emit('close_register_success_modal')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.296 7.115C18.6853 6.72564 18.6853 6.09436 18.296 5.705C17.9066 5.31564 17.2753 5.31564 16.886 5.705L12.001 10.59L7.11598 5.705C6.72662 5.31564 6.09534 5.31564 5.70598 5.705C5.31662 6.09436 5.31662 6.72564 5.70598 7.115L10.591 12L5.70598 16.885C5.31662 17.2744 5.31662 17.9056 5.70598 18.295C6.09534 18.6844 6.72662 18.6844 7.11598 18.295L12.001 13.41L16.886 18.295C17.2753 18.6844 17.9066 18.6844 18.296 18.295C18.6853 17.9056 18.6853 17.2744 18.296 16.885L13.411 12L18.296 7.115Z" fill="white"/>
                    </svg>
                </button>

                <!-- Register success modal - Title -->
                <div class="title">Congratulations!</div>

                <!-- Register success modal - Description -->
                <div class="desc">Now you are Bust or Boom player!<br> Enjoy you bets!</div>

                <!-- Register success modal - Image -->
                <img src="@/assets/register_success_img.png" alt="" class="img">

                <!-- Register success modal - Button -->
                <div class="btns">
                    <button class="btn" @click.prevent="emitter.emit('close_register_success_modal')">Enjoy</button>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup>
    import { inject } from 'vue'


    const emitter = inject('emitter')
</script>


<style scoped>
    .modal_content
    {
        position: absolute;
        z-index: 3;
        bottom: 0;
        left: 0;

        display: flex;
        overflow: auto;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 100%;
        height: 100%;
        padding: 10px;
    }


    .modal_content .data
    {
        position: relative;

        width: 100%;
        padding: 20px;

        pointer-events: auto;

        border-radius: 20px;
        background: #003504;
    }


    .modal_content .data:before
    {
        display: none;
    }


    .modal_content .title
    {
        font-size: 24px;
        font-weight: 600;

        margin-bottom: 24px;

        text-align: center;
    }


    .modal_content .desc
    {
        font-size: 18px;

        margin-bottom: 24px;

        text-align: center;
    }
</style>