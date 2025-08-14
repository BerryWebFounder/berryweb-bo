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
                const { getOptional } = useApi()

                // Authorization 헤더는 선택사항 (public endpoint로 추정)
                const response = await getOptional(`/v1/shops/${shopId}/categories`)

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
                const { post } = useApi()

                // Authorization 헤더 필수 (카테고리 생성은 인증 필요)
                const response = await post(`/v1/shops/${shopId}/categories`, categoryData)

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
                const { put } = useApi()

                // Authorization 헤더 필수
                const response = await put(`/v1/shops/${shopId}/categories/${categoryId}`, categoryData)

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
                const { del } = useApi()

                // Authorization 헤더 필수
                const response = await del(`/v1/shops/${shopId}/categories/${categoryId}`)

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
        },

        // 상태 초기화
        clearError() {
            this.error = null
        },

        clearCurrentCategory() {
            this.currentCategory = null
        },

        clearCategories() {
            this.categories = []
        }
    }
})