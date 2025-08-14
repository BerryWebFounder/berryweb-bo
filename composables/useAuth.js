export const useAuth = () => {
    // 토큰 가져오기 (auth store와 일관성 유지)
    const getToken = () => {
        if (process.client) {
            return localStorage.getItem('auth-token') ||
                sessionStorage.getItem('auth-token') ||
                useCookie('auth-token').value
        }
        return null
    }

    // 토큰 저장 (auth store와 일관성 유지)
    const setToken = (token) => {
        if (process.client) {
            localStorage.setItem('auth-token', token)
            useCookie('auth-token', { default: () => token }).value = token
        }
    }

    // 토큰 제거 (auth store와 일관성 유지)
    const removeToken = () => {
        if (process.client) {
            localStorage.removeItem('auth-token')
            sessionStorage.removeItem('auth-token')
            useCookie('auth-token').value = null
        }
    }

    // 인증된 API 헤더 가져오기
    const getAuthHeaders = () => {
        const token = getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    // 인증된 API 요청 (deprecated - useApi를 사용하는 것을 권장)
    const authenticatedRequest = async (url, options = {}) => {
        const { get, post, put, del } = useApi()

        const method = options.method?.toLowerCase() || 'get'

        try {
            switch (method) {
                case 'post':
                    return await post(url, options.body, options)
                case 'put':
                    return await put(url, options.body, options)
                case 'delete':
                    return await del(url, options)
                default:
                    return await get(url, options)
            }
        } catch (error) {
            // 401 에러 시 토큰 제거 및 로그인 페이지로 이동
            if (error.status === 401) {
                removeToken()
                await navigateTo('/login')
            }
            throw error
        }
    }

    // 로그인 상태 확인
    const isAuthenticated = computed(() => {
        return !!getToken()
    })

    return {
        getToken,
        setToken,
        removeToken,
        getAuthHeaders,
        authenticatedRequest,
        isAuthenticated
    }
}