import { createRouter, createWebHistory } from 'vue-router'
import { useGlobalStore } from '@/store'


const routes = [
	{
		path: '/',
		name: 'ConnectPage',
		component: () => import('../views/ConnectPage.vue'),
		meta: {
			accessDenied: ['connected']
		}
	},
	{
		path: '/register',
		name: 'RegisterPage',
		component: () => import('../views/RegisterPage.vue'),
		meta: {
			accessDenied: ['not_connected']
		}
	},
	{
		path: '/main',
		name: 'MainPage',
		component: () => import('../views/MainPage.vue'),
		meta: {
			accessDenied: ['not_connected']
		}
	},
	{
		path: '/my_bets',
		name: 'MyBetsPage',
		component: () => import('../views/MyBetsPage.vue'),
		meta: {
			accessDenied: ['not_connected']
		}
	},
	{
		path: '/leaderboard',
		name: 'LeaderboardPage',
		component: () => import('../views/LeaderboardPage.vue'),
		meta: {
			accessDenied: ['not_connected']
		}
	},
]


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})


router.beforeResolve((to, from, next) => {
	let store = useGlobalStore()

	// Check access
	to.matched.some(record => {
		let access = record.meta.accessDenied

		if(access.length) {
			// Connected
			if(access.includes('connected') && store.isConnected) {
				// Redirect
				next({ name: 'MainPage' })

				return false
			}

			// Not connected
			if(access.includes('not_connected') && !store.isConnected) {
				// Redirect
				next({ name: 'ConnectPage' })

				return false
			}

			else {
				next()
			}
		}
	})
})


export default router
