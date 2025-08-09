export const useApi = () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const toast = useToast()

    const request = async (url, options = {}) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            }

            if (authStore.token) {
                headers.Authorization = `Bearer ${authStore.token}`
            }

            const response = await $fetch(`${config.public.apiBase}${url}`, {
                ...options,
                headers
            })

            return response
        } catch (error) {
            console.error('API 요청 실패:', error)

            if (error.status === 401) {
                authStore.logout()
                return
            }

            const message = error.data?.message || error.message || 'API 요청에 실패했습니다.'
            toast.error(message)

            throw error
        }
    }

    return {
        get: (url, options = {}) => request(url, { method: 'GET', ...options }),
        post: (url, body, options = {}) => request(url, { method: 'POST', body, ...options }),
        put: (url, body, options = {}) => request(url, { method: 'PUT', body, ...options }),
        patch: (url, body, options = {}) => request(url, { method: 'PATCH', body, ...options }),
        delete: (url, options = {}) => request(url, { method: 'DELETE', ...options })
    }
}