import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
    }),

    actions: {
        async login(credentials) {
            this.loading = true
            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`${config.public.apiBase}/auth/login`, {
                    method: 'POST',
                    body: credentials
                })

                this.setAuth(response.token, response.user)
                await navigateTo('/dashboard')
                return response
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async loginWithOAuth(provider, code) {
            this.loading = true
            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`${config.public.apiBase}/auth/oauth2/${provider}`, {
                    method: 'POST',
                    body: { code }
                })

                this.setAuth(response.token, response.user)
                await navigateTo('/dashboard')
                return response
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        setAuth(token, user) {
            this.token = token
            this.user = user
            this.isAuthenticated = true

            // 토큰을 로컬스토리지에 저장
            if (process.client) {
                localStorage.setItem('auth-token', token)
            }
        },

        async logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false

            if (process.client) {
                localStorage.removeItem('auth-token')
            }

            await navigateTo('/login')
        },

        async fetchUser() {
            if (!this.token) return

            try {
                const config = useRuntimeConfig()
                const user = await $fetch(`${config.public.apiBase}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })
                this.user = user
            } catch (error) {
                this.logout()
            }
        }
    }
})