export const useApi = () => {
    const config = useRuntimeConfig()
    const API_BASE_URL = config.public.apiBaseUrl || 'http://localhost:8083'

    // 토큰 가져오기
    const getAuthToken = () => {
        if (process.client) {
            return localStorage.getItem('auth.token') ||
                sessionStorage.getItem('auth.token') ||
                useCookie('auth.token').value
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

    // GET 요청
    const get = async (url, options = {}) => {
        try {
            const response = await $fetch(`${API_BASE_URL}${url}`, {
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

    // POST 요청
    const post = async (url, data, options = {}) => {
        try {
            const response = await $fetch(`${API_BASE_URL}${url}`, {
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
            const response = await $fetch(`${API_BASE_URL}${url}`, {
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
            const response = await $fetch(`${API_BASE_URL}${url}`, {
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

    // 에러 처리
    const handleApiError = async (error) => {
        if (error.status === 401) {
            // 토큰 제거
            if (process.client) {
                localStorage.removeItem('auth.token')
                sessionStorage.removeItem('auth.token')
                const tokenCookie = useCookie('auth.token')
                tokenCookie.value = null
            }

            // 로그인 페이지로 리다이렉트
            await navigateTo('/login')
        }
    }

    return {
        get,
        post,
        put,
        delete: del,
        getAuthToken,
        getHeaders
    }
}