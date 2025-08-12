import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        userSessions: [],
        userRoleHistory: [],
        loading: false,
        error: null,
        pagination: {
            page: 0,
            size: 20,
            totalElements: 0,
            totalPages: 0
        }
    }),

    actions: {
        // 현재 사용자 정보 조회
        async getCurrentUser() {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success && response.data) {
                    this.currentUser = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '사용자 정보 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 모든 사용자 조회 (관리자용)
        async fetchUsers(params = {}) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({
                    page: params.page || 0,
                    size: params.size || 20,
                    sortBy: params.sortBy || 'id',
                    search: params.search || ''
                })

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success && response.data) {
                    // Spring Data Page 응답 처리
                    if (response.data.content) {
                        this.users = response.data.content
                        this.pagination = {
                            page: response.data.number,
                            size: response.data.size,
                            totalElements: response.data.totalElements,
                            totalPages: response.data.totalPages
                        }
                    } else {
                        this.users = response.data
                    }
                    return response
                } else {
                    throw new Error(response.message || '사용자 목록 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('Fetch users error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 사용자 생성 (관리자용)
        async createUser(userData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: userData
                })

                if (response.success && response.data) {
                    this.users.unshift(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '사용자 생성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 사용자 수정
        async updateUser(userId, userData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: userData
                })

                if (response.success && response.data) {
                    const index = this.users.findIndex(u => u.id === userId)
                    if (index !== -1) {
                        this.users[index] = response.data
                    }
                    if (this.currentUser?.id === userId) {
                        this.currentUser = response.data
                    }
                    return response.data
                } else {
                    throw new Error(response.message || '사용자 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 사용자 삭제
        async deleteUser(userId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.users = this.users.filter(u => u.id !== userId)
                    if (this.currentUser?.id === userId) {
                        this.currentUser = null
                    }
                } else {
                    throw new Error(response.message || '사용자 삭제에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 비밀번호 변경
        async changePassword(passwordData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users/me/change-password`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: passwordData
                })

                if (response.success) {
                    return response
                } else {
                    throw new Error(response.message || '비밀번호 변경에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 현재 사용자 세션 목록 조회
        async getCurrentUserSessions() {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}/users/me/sessions`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success && response.data) {
                    this.userSessions = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '세션 목록 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 사용자 권한 변경 이력 조회
        async getUserRoleHistory(userId = null) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const endpoint = userId
                    ? `/users/${userId}/role-history`
                    : '/users/me/role-history'

                // ✅ User 서비스(8081)로 요청
                const response = await $fetch(`${config.public.services.user}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success && response.data) {
                    this.userRoleHistory = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '권한 변경 이력 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 상태 초기화
        clearError() {
            this.error = null
        },

        clearCurrentUser() {
            this.currentUser = null
        }
    }
})