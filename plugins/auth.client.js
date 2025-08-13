export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()

    // 🔥 중요: restoreAuth() 메서드 호출 추가
    authStore.restoreAuth()

    // 토큰이 있으면 사용자 정보도 가져오기
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchUser()
        } catch (error) {
            console.error('사용자 정보 복원 실패:', error)
            // 토큰은 있지만 사용자 정보를 가져올 수 없으면 로그아웃
            authStore.logout()
        }
    }
})