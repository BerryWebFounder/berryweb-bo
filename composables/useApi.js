export const useApi = () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const toast = useToast()

    const getServiceUrl = (path) => {
        const services = config.public.services

        // API 경로에 따라 적절한 서비스 URL 반환
        if (path.startsWith('/v1/auth') || path.startsWith('/auth') ||
            path.startsWith('/v1/users') || path.startsWith('/users')) {
            return services.user
        }

        if (path.startsWith('/v1/shops') || path.startsWith('/shops')) {
            return services.shop
        }

        if (path.startsWith('/v1/products') || path.startsWith('/products')) {
            return services.product
        }

        if (path.startsWith('/v1/categories') || path.startsWith('/categories')) {
            return services.category
        }

        if (path.startsWith('/v1/files') || path.startsWith('/files') ||
            path.startsWith('/admin/files')) {
            return services.file
        }

        if (path.startsWith('/v1/boards') || path.startsWith('/boards') ||
            path.startsWith('/admin/boards')) {
            return services.board
        }

        // 기본값은 user 서비스
        return services.user
    }

    const request = async (url, options = {}) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            }

            if (authStore.token) {
                headers.Authorization = `Bearer ${authStore.token}`
            }

            let apiUrl = url
            if (!url.startsWith('http')) {
                const serviceUrl = getServiceUrl(url)
                apiUrl = `${serviceUrl}${url}`

                // 디버깅용 로그
                console.log(`API Request: ${url} -> ${apiUrl}`)
            }

            const response = await $fetch(apiUrl, {
                ...options,
                headers
            })

            if (response && typeof response === 'object' && 'success' in response) {
                if (!response.success) {
                    throw new Error(response.message || 'API 요청에 실패했습니다.')
                }
                return response
            }

            return response

        } catch (error) {
            console.error('API 요청 실패:', error)

            if (error.status === 401) {
                authStore.logout()
                return
            }

            let message = 'API 요청에 실패했습니다.'

            if (error.data?.message) {
                message = error.data.message
            } else if (error.data?.errors?.length > 0) {
                message = error.data.errors[0]
            } else if (error.message) {
                message = error.message
            }

            toast.error(message)
            throw error
        }
    }

    return {
        get: (url, options = {}) => request(url, { method: 'GET', ...options }),
        post: (url, body, options = {}) => request(url, { method: 'POST', body, ...options }),
        put: (url, body, options = {}) => request(url, { method: 'PUT', body, ...options }),
        patch: (url, body, options = {}) => request(url, { method: 'PATCH', body, ...options }),
        delete: (url, options = {}) => request(url, { method: 'DELETE', ...options }),

        userService: {
            get: (path, options = {}) => request(`/v1${path.startsWith('/') ? '' : '/'}${path}`, { method: 'GET', ...options }),
            post: (path, body, options = {}) => request(`/v1${path.startsWith('/') ? '' : '/'}${path}`, { method: 'POST', body, ...options }),
            put: (path, body, options = {}) => request(`/v1${path.startsWith('/') ? '' : '/'}${path}`, { method: 'PUT', body, ...options }),
            delete: (path, options = {}) => request(`/v1${path.startsWith('/') ? '' : '/'}${path}`, { method: 'DELETE', ...options })
        },

        shopService: {
            get: (path, options = {}) => request(`/v1/shops${path.startsWith('/') ? '' : '/'}${path}`, { method: 'GET', ...options }),
            post: (path, body, options = {}) => request(`/v1/shops${path.startsWith('/') ? '' : '/'}${path}`, { method: 'POST', body, ...options }),
            put: (path, body, options = {}) => request(`/v1/shops${path.startsWith('/') ? '' : '/'}${path}`, { method: 'PUT', body, ...options }),
            delete: (path, options = {}) => request(`/v1/shops${path.startsWith('/') ? '' : '/'}${path}`, { method: 'DELETE', ...options })
        }
    }
}