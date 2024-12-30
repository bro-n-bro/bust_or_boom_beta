<template>
	<div class="main">
		<!-- Rrouter view -->
		<router-view />
	</div>

	<!-- Register success modal -->
	<transition name="fade">
	<RegisterSuccessModal v-if="showRegisterSuccessModal" />
	</transition>

	<!-- Overlay -->
	<transition name="fade">
	<div class="modal_overlay" @click.prevent="emitter.emit('close_register_success_modal')" v-if="showRegisterSuccessModal"></div>
    </transition>
</template>


<script setup>
	import { ref, inject, onMounted } from 'vue'
    import { useGlobalStore } from '@/store'

	// Components
    import RegisterSuccessModal from '@/components/RegisterSuccessModal.vue'


	const store = useGlobalStore(),
		emitter = inject('emitter'),
		showRegisterSuccessModal = ref(false)


	onMounted(() => {
		// Init
		store.init()
	})


    // Event "show_register_success_modal"
	emitter.on('show_register_success_modal', () => {
		// Show register success modal
        showRegisterSuccessModal.value = true
    })


    // Event "close_register_success_modal"
    emitter.on('close_register_success_modal', () => {
		// Hide register success modal
        showRegisterSuccessModal.value = false
    })
</script>