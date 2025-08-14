export const useApi = () => {
    const config = useRuntimeConfig()

    // 서비스별 API URL 설정
    const USER_API_BASE = config.public.services?.user || 'http://localhost:8081'
    const SHOP_API_BASE = config.public.services?.shop || 'http://localhost:8083'

    // 토큰 가져오기
    const getAuthToken = () => {
        if (process.client) {
            return localStorage.getItem('auth-token') ||
                sessionStorage.getItem('auth-token') ||
                useCookie('auth-token').value
        }
        return null
    }

    // 기본 헤더 생성
    const getHeaders = (additionalHeaders = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...additionalHeaders
        }

        const token = getAuthToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return headers
    }

    // 조건부 Authorization 헤더 추가
    const getOptionalAuthHeaders = (additionalHeaders = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...additionalHeaders
        }

        const token = getAuthToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return headers
    }

    // GET 요청 (필수 인증)
    const get = async (url, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const response = await $fetch(`${apiBase}${url}`, {
                method: 'GET',
                headers: getHeaders(options.headers),
                query: options.params,
                ...options
            })
            return response
        } catch (error) {
            await handleApiError(error)
            throw error
        }
    }

    // GET 요청 (선택적 인증)
    const getOptional = async (url, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const response = await $fetch(`${apiBase}${url}`, {
                method: 'GET',
                headers: getOptionalAuthHeaders(options.headers),
                query: options.params,
                ...options
            })
            return response
        } catch (error) {
            await handleApiError(error)
            throw error
        }
    }

    // POST 요청
    const post = async (url, data, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const response = await $fetch(`${apiBase}${url}`, {
                method: 'POST',
                headers: getHeaders(options.headers),
                body: data,
                ...options
            })
            return response
        } catch (error) {
            await handleApiError(error)
            throw error
        }
    }

    // PUT 요청
    const put = async (url, data, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const response = await $fetch(`${apiBase}${url}`, {
                method: 'PUT',
                headers: getHeaders(options.headers),
                body: data,
                ...options
            })
            return response
        } catch (error) {
            await handleApiError(error)
            throw error
        }
    }

    // DELETE 요청
    const del = async (url, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const response = await $fetch(`${apiBase}${url}`, {
                method: 'DELETE',
                headers: getHeaders(options.headers),
                ...options
            })
            return response
        } catch (error) {
            await handleApiError(error)
            throw error
        }
    }

    // API Base URL 결정
    const getApiBase = (url) => {
        // User Service 관련 API
        if (url.includes('/auth/') || url.includes('/users/')) {
            return USER_API_BASE
        }
        // Shop Service 관련 API (기본값)
        return SHOP_API_BASE
    }

    // 에러 처리
    const handleApiError = async (error) => {
        if (error.status === 401) {
            // 토큰 제거
            if (process.client) {
                localStorage.removeItem('auth-token')
                sessionStorage.removeItem('auth-token')
                const tokenCookie = useCookie('auth-token')
                tokenCookie.value = null
            }

            // 로그인 페이지로 리다이렉트
            await navigateTo('/login')
        }
    }

    return {
        get,
        getOptional,
        post,
        put,
        delete: del,
        getAuthToken,
        getHeaders,
        getOptionalAuthHeaders,
        USER_API_BASE,
        SHOP_API_BASE
    }
}