<template>
	<div class="main">
		<!-- Rrouter view -->
		<router-view />
	</div>

	<!-- Register success modal -->
	<transition name="fade">
	<RegisterSuccessModal v-if="showRegisterSuccessModal" />
	</transition>

	<!-- Profile modal -->
	<transition name="modal">
	<ProfileModal v-if="showProfileModal" />
	</transition>

	<!-- Overlay -->
	<transition name="fade">
	<div class="modal_overlay" @click.prevent="emitter.emit('close_register_success_modal')" v-if="showRegisterSuccessModal || showProfileModal"></div>
    </transition>
</template>


<script setup>
	import { ref, inject, onBeforeMount, onMounted, onUnmounted } from 'vue'
    import { useGlobalStore } from '@/store'
    import { useRouter } from 'vue-router'
    import { useTitle } from '@vueuse/core'

	// Components
    import RegisterSuccessModal from '@/components/RegisterSuccessModal.vue'
    import ProfileModal from '@/components/ProfileModal.vue'


	const store = useGlobalStore(),
		emitter = inject('emitter'),
        router = useRouter(),
        title = useTitle(),
        startY = ref(0),
        isPulling = ref(false),
        threshold = 70,
		showRegisterSuccessModal = ref(false),
		showProfileModal = ref(false)


    onBeforeMount(() => {
        // Set page title
        title.value = 'Bust or Boom'
    })


	onMounted(() => {
		// Init
		store.init()

        // Overscroll
        window.addEventListener('touchstart', handleTouchStart, { passive: false })
        window.addEventListener('touchmove', handleTouchMove, { passive: false })
        window.addEventListener('touchend', handleTouchEnd, { passive: false })
    })


    onUnmounted(() => {
        window.removeEventListener('touchstart', handleTouchStart, { passive: false })
        window.removeEventListener('touchmove', handleTouchMove, { passive: false })
        window.removeEventListener('touchend', handleTouchEnd, { passive: false })
    })


    // Handle touch start
    function handleTouchStart(e) {
        if (window.scrollY === 0) {
            isPulling.value = true
        }
    }


    // Handle touch move
    function handleTouchMove(e) {
        if (!isPulling.value) return

        let currentY = e.touches[0].pageY,
            distance = currentY - startY.value

        if (distance > 0 && distance >= threshold) {
            e.preventDefault()
            e.stopPropagation()

            // Close any modal
            if (store.isAnyModalOpen) {
                // Set event "close_any_modal"
                emitter.emit('close_any_modal')

                isPulling.value = false

                return
            }
        }
    }


    // Handle touch end
    function handleTouchEnd(e) {
        isPulling.value = false
    }


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


	// Event "show_profile_modal"
	emitter.on('show_profile_modal', () => {
		// Show profile modal
        showProfileModal.value = true

		// Update status
        store.isAnyModalOpen = true
    })


    // Event "close_profile_modal"
    emitter.on('close_profile_modal', () => {
		// Hide profile modal
        showProfileModal.value = false

		// Update status
        store.isAnyModalOpen = false
    })


	// Event "close_any_modal"
	emitter.on('close_any_modal', () => {
		// Hide profile modal
        showProfileModal.value = false

		// Update status
		store.isAnyModalOpen = false
	})


	// JetPack event wallet changed
	window.jetPack.on('walletChanged', () => {
		// Reset websocket connection
		if (store.websocket) {
			store.websocket.onopen = null
			store.websocket.onmessage = null

			store.websocket.close()
		}

		// Reset connected status
		store.isConnected = false

		// Redirect
		router.push({ path: '/' })
	})
</script>