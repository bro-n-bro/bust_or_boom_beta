<template>
	<router-view />

	<RegisterSuccessModal v-if="showRegisterSuccessModal" />

	<div class="modal_overlay" @click.prevent="emitter.emit('close_register_success_modal')" v-if="showRegisterSuccessModal"></div>
</template>


<script setup>
	import { ref, inject } from 'vue'

    import RegisterSuccessModal from '@/components/RegisterSuccessModal.vue'


	const emitter = inject('emitter'),
		showRegisterSuccessModal = ref(false)


	emitter.on('show_register_success_modal', () => {
        showRegisterSuccessModal.value = true
    })

    emitter.on('close_register_success_modal', () => {
        showRegisterSuccessModal.value = false
    })
</script>