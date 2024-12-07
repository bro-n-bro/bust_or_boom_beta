import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueCountdown from '@chenfengyuan/vue-countdown'


// Create App
const app = createApp(App)

// Pinia
const pinia = createPinia()

// Vue use
app.use(pinia)
app.use(router)

// VueCountdown
app.component(VueCountdown.name, VueCountdown)

// Mount
app.mount('#app')
