<template>
	<div class="main">
		<router-view />
	</div>

	<RegisterSuccessModal v-if="showRegisterSuccessModal" />

	<div class="modal_overlay" @click.prevent="emitter.emit('close_register_success_modal')" v-if="showRegisterSuccessModal"></div>
</template>


<script setup>
	import { ref, inject, onMounted } from 'vue'
    import { useGlobalStore } from '@/store'

    import RegisterSuccessModal from '@/components/RegisterSuccessModal.vue'


	const store = useGlobalStore(),
		emitter = inject('emitter'),
		showRegisterSuccessModal = ref(false)


	onMounted(() => {
		// Init
		store.init()
	})


	emitter.on('show_register_success_modal', () => {
        showRegisterSuccessModal.value = true
    })

    emitter.on('close_register_success_modal', () => {
        showRegisterSuccessModal.value = false
    })
</script>