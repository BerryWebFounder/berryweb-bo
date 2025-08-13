export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Axios 인스턴스 생성
    const api = $fetch.create({
        baseURL: config.public.apiBaseUrl || 'http://localhost:8083',
        onRequest({ request, options }) {
            // 토큰이 있으면 자동으로 Authorization 헤더 추가
            if (process.client) {
                const token = localStorage.getItem('auth.token') || sessionStorage.getItem('auth.token')
                if (token) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        },
        onRequestError({ request, options, error }) {
            console.error('API Request Error:', error)
        },
        onResponse({ request, response, options }) {
            // 응답 로깅 (개발 환경에서만)
            if (process.dev) {
                console.log('API Response:', response.status, response._data)
            }
        },
        onResponseError({ request, response, options }) {
            console.error('API Response Error:', response.status, response._data)

            // 401 에러 시 로그인 페이지로 리다이렉트
            if (response.status === 401 && process.client) {
                localStorage.removeItem('auth.token')
                sessionStorage.removeItem('auth.token')
                navigateTo('/login')
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})