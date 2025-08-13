export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // 클라이언트 사이드에서만 실행
    if (process.client) {
        // 플러그인에서 이미 인증 상태를 복원했으므로 단순히 체크만
        if (!authStore.isAuthenticated || !authStore.token) {
            console.log('인증되지 않은 사용자, 로그인 페이지로 리다이렉트')
            return navigateTo('/login')
        }

        // 사용자 정보가 없으면 가져오기 시도
        if (!authStore.user) {
            authStore.fetchUser().catch(() => {
                console.log('사용자 정보 조회 실패, 로그인 페이지로 리다이렉트')
                authStore.logout()
            })
        }
    }
})