export const useApi = () => {
    const config = useRuntimeConfig()

    // 서비스별 API URL 설정 (이미 /api가 포함됨)
    const USER_API_BASE = config.public.services?.user || 'http://localhost:8081/api'
    const SHOP_API_BASE = config.public.services?.shop || 'http://localhost:8083/api'

    // 토큰 가져오기
    const getAuthToken = () => {
        if (process.client) {
            return localStorage.getItem('auth-token') ||
                sessionStorage.getItem('auth-token') ||
                useCookie('auth-token').value
        }
        return null
    }

    // 기본 헤더 생성 (인증 필수)
    const getHeaders = (additionalHeaders = {}, isFormData = false) => {
        const headers = {}

        // FormData가 아닌 경우에만 Content-Type 설정
        if (!isFormData) {
            headers['Content-Type'] = 'application/json'
        }

        // 추가 헤더 병합 (단, FormData인 경우 Content-Type 제외)
        Object.keys(additionalHeaders).forEach(key => {
            if (!(isFormData && key.toLowerCase() === 'content-type')) {
                headers[key] = additionalHeaders[key]
            }
        })

        const token = getAuthToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return headers
    }

    // 조건부 Authorization 헤더 추가 (인증 선택적)
    const getOptionalAuthHeaders = (additionalHeaders = {}, isFormData = false) => {
        const headers = {}

        // FormData가 아닌 경우에만 Content-Type 설정
        if (!isFormData) {
            headers['Content-Type'] = 'application/json'
        }

        // 추가 헤더 병합
        Object.keys(additionalHeaders).forEach(key => {
            if (!(isFormData && key.toLowerCase() === 'content-type')) {
                headers[key] = additionalHeaders[key]
            }
        })

        const token = getAuthToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return headers
    }

    // API Base URL 결정 (간단화)
    const getApiBase = (url) => {
        // User Service 관련 API
        if (url.includes('/v1/auth/') || url.includes('/v1/users/')) {
            return USER_API_BASE
        }
        // Shop Service 관련 API (모든 나머지)
        return SHOP_API_BASE
    }

    // 에러 처리
    const handleApiError = async (error) => {
        console.error('API Error:', error)

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

    // GET 요청 (필수 인증)
    const get = async (url, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const fullUrl = `${apiBase}${url}`

            const response = await $fetch(fullUrl, {
                method: 'GET',
                headers: getHeaders(options.headers),
                query: options.params,
                ...options
            })
            return response
        } catch (error) {
            console.error('GET Request failed:', error)
            await handleApiError(error)
            throw error
        }
    }

    // GET 요청 (선택적 인증)
    const getOptional = async (url, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const fullUrl = `${apiBase}${url}`

            console.log('GET Optional Request URL:', fullUrl)

            const response = await $fetch(fullUrl, {
                method: 'GET',
                headers: getOptionalAuthHeaders(options.headers),
                query: options.params,
                ...options
            })
            return response
        } catch (error) {
            console.error('GET Optional Request failed:', error)
            await handleApiError(error)
            throw error
        }
    }

    // POST 요청
    const post = async (url, data, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const fullUrl = `${apiBase}${url}`

            // FormData 감지
            const isFormData = data instanceof FormData

            console.log('POST Request URL:', fullUrl)
            console.log('POST Request Data Type:', isFormData ? 'FormData' : 'JSON')
            console.log('POST Request Data:', isFormData ? 'FormData object' : data)

            const response = await $fetch(fullUrl, {
                method: 'POST',
                headers: getHeaders(options.headers, isFormData),
                body: data,
                ...options
            })
            return response
        } catch (error) {
            console.error('POST Request failed:', error)
            await handleApiError(error)
            throw error
        }
    }

    // PUT 요청
    const put = async (url, data, options = {}) => {
        try {
            const apiBase = getApiBase(url)
            const fullUrl = `${apiBase}${url}`

            // FormData 감지
            const isFormData = data instanceof FormData

            const response = await $fetch(fullUrl, {
                method: 'PUT',
                headers: getHeaders(options.headers, isFormData),
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
            const fullUrl = `${apiBase}${url}`

            const response = await $fetch(fullUrl, {
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