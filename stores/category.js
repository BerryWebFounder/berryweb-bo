import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        currentCategory: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchCategories(shopId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/shops/${shopId}/categories`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.categories = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '카테고리 목록 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.message
                console.error('카테고리 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createCategory(shopId, categoryData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/shops/${shopId}/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: categoryData
                })

                if (response.success) {
                    this.categories.push(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '카테고리 생성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.message
                console.error('카테고리 생성 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateCategory(shopId, categoryId, categoryData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/shops/${shopId}/categories/${categoryId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: categoryData
                })

                if (response.success) {
                    const index = this.categories.findIndex(c => c.id === categoryId)
                    if (index !== -1) {
                        this.categories[index] = response.data
                    }
                    return response.data
                } else {
                    throw new Error(response.message || '카테고리 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.message
                console.error('카테고리 수정 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteCategory(shopId, categoryId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/shops/${shopId}/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    this.categories = this.categories.filter(c => c.id !== categoryId)
                } else {
                    throw new Error(response.message || '카테고리 삭제에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.message
                console.error('카테고리 삭제 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})