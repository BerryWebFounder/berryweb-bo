export const useAuth = () => {
    // 토큰 가져오기
    const getToken = () => {
        if (process.client) {
            return localStorage.getItem('auth.token') ||
                sessionStorage.getItem('auth.token') ||
                useCookie('auth.token').value
        }
        return null
    }

    // 토큰 저장
    const setToken = (token) => {
        if (process.client) {
            localStorage.setItem('auth.token', token)
            useCookie('auth.token', { default: () => token }).value = token
        }
    }

    // 토큰 제거
    const removeToken = () => {
        if (process.client) {
            localStorage.removeItem('auth.token')
            sessionStorage.removeItem('auth.token')
            useCookie('auth.token').value = null
        }
    }

    // 인증된 API 헤더 가져오기
    const getAuthHeaders = () => {
        const token = getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    // 인증된 API 요청
    const authenticatedRequest = async (url, options = {}) => {
        const { $api } = useNuxtApp()

        const requestOptions = {
            ...options,
            headers: {
                ...options.headers,
                ...getAuthHeaders()
            }
        }

        try {
            return await $api(url, requestOptions)
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