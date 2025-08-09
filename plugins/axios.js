export default defineNuxtPlugin(() => {
    const authStore = useAuthStore()

    // axios 인터셉터 설정 (필요시)
    $fetch.create({
        onRequest({ request, options }) {
            if (authStore.token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authStore.token}`
                }
            }
        },

        onResponseError({ response }) {
            if (response.status === 401) {
                authStore.logout()
            }
        }
    })
})