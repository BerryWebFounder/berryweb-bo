export default defineNuxtPlugin(() => {
    const authStore = useAuthStore()

    // 페이지 로드시 토큰 체크
    const token = localStorage.getItem('auth-token')
    if (token) {
        authStore.token = token
        authStore.isAuthenticated = true
        authStore.fetchUser()
    }
})