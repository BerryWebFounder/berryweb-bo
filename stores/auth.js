import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
    }),

    actions: {
        async login(credentials) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()

                // 백엔드 API에 맞게 로그인 데이터 구조 수정
                const loginData = {
                    usernameOrEmail: credentials.email || credentials.usernameOrEmail,
                    password: credentials.password
                }

                console.log('Sending login request:', loginData)

                const response = await $fetch(`${config.public.apiBase}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: loginData
                })

                // 백엔드 응답 구조에 맞게 수정 (ApiResponse 형태)
                if (response.success && response.data) {
                    this.setAuth(response.data.token, response.data.user)
                    await navigateTo('/dashboard')
                    return response
                } else {
                    throw new Error(response.message || '로그인에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message || '로그인에 실패했습니다.'
                console.error('Login error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async loginWithOAuth(provider, code) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`${config.public.apiBase}/api/v1/auth/oauth2/${provider}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: { code }
                })

                if (response.success && response.data) {
                    this.setAuth(response.data.token, response.data.user)
                    await navigateTo('/dashboard')
                    return response
                } else {
                    throw new Error(response.message || 'OAuth 로그인에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message || 'OAuth 로그인에 실패했습니다.'
                throw error
            } finally {
                this.loading = false
            }
        },

        setAuth(token, user) {
            this.token = token
            this.user = user
            this.isAuthenticated = true
            this.error = null

            // 토큰을 로컬스토리지에 저장
            if (process.client) {
                localStorage.setItem('auth-token', token)
                if (user) {
                    localStorage.setItem('auth-user', JSON.stringify(user))
                }
            }
        },

        async logout() {
            try {
                const config = useRuntimeConfig()

                // 백엔드에 로그아웃 요청 (옵션)
                if (this.token) {
                    await $fetch(`${config.public.apiBase}/api/v1/auth/logout`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }).catch(error => {
                        console.warn('로그아웃 요청 실패:', error)
                    })
                }
            } finally {
                // 로컬 상태 정리
                this.user = null
                this.token = null
                this.isAuthenticated = false
                this.error = null

                if (process.client) {
                    localStorage.removeItem('auth-token')
                    localStorage.removeItem('auth-user')
                }

                await navigateTo('/login')
            }
        },

        async fetchUser() {
            if (!this.token) return

            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`${config.public.apiBase}/api/v1/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })

                // 백엔드 응답 구조에 맞게 수정
                if (response.success && response.data) {
                    this.user = response.data

                    if (process.client) {
                        localStorage.setItem('auth-user', JSON.stringify(response.data))
                    }
                } else {
                    throw new Error('사용자 정보를 가져올 수 없습니다.')
                }
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error)
                this.logout()
            }
        },

        async refreshToken() {
            if (!this.token) return false

            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`${config.public.apiBase}/api/v1/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })

                if (response.success && response.data) {
                    this.setAuth(response.data.token, response.data.user || this.user)
                    return true
                } else {
                    throw new Error('토큰 갱신에 실패했습니다.')
                }
            } catch (error) {
                console.error('토큰 갱신 실패:', error)
                this.logout()
                return false
            }
        },

        // 로컬스토리지에서 인증 정보 복원
        restoreAuth() {
            if (process.client) {
                const token = localStorage.getItem('auth-token')
                const userStr = localStorage.getItem('auth-user')

                if (token) {
                    this.token = token
                    this.isAuthenticated = true

                    if (userStr) {
                        try {
                            this.user = JSON.parse(userStr)
                        } catch (error) {
                            console.error('사용자 정보 파싱 실패:', error)
                        }
                    }

                    // 사용자 정보가 없거나 유효하지 않으면 다시 조회
                    if (!this.user) {
                        this.fetchUser()
                    }
                }
            }
        },

        // 권한 체크
        hasRole(role) {
            return this.user?.role === role || this.user?.roles?.includes(role)
        },

        hasAnyRole(roles) {
            if (!this.user) return false
            if (this.user.role && roles.includes(this.user.role)) return true
            if (this.user.roles) {
                return roles.some(role => this.user.roles.includes(role))
            }
            return false
        },

        isAdmin() {
            return this.hasAnyRole(['ADMIN', 'SYSOP'])
        }
    }
})