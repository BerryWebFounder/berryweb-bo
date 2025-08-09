export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // 클라이언트 사이드에서만 실행
    if (process.client) {
        const token = localStorage.getItem('auth-token')

        if (token && !authStore.isAuthenticated) {
            authStore.token = token
            authStore.isAuthenticated = true
            authStore.fetchUser()
        }

        if (!authStore.isAuthenticated) {
            return navigateTo('/login')
        }
    }
})