import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        categories: [],
        reviews: [],
        currentProduct: null,
        loading: false,
        error: null,
        pagination: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0
        }
    }),

    actions: {
        async fetchProducts(shopId, params = {}) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({
                    page: params.page || 0,
                    size: params.size || 10,
                    search: params.search || '',
                    ...params
                })

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}/products?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                // Spring Data JPA Page 응답 구조
                if (response.data?.content) {
                    this.products = response.data.content
                    this.pagination = {
                        page: response.data.number,
                        size: response.data.size,
                        totalElements: response.data.totalElements,
                        totalPages: response.data.totalPages
                    }
                } else {
                    this.products = response.data || response
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async getProductById(productId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.currentProduct = response.data || response
                return this.currentProduct
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async createProduct(shopId, productData, images = []) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                // 이미지가 있는 경우 FormData 사용
                if (images && images.length > 0) {
                    const formData = new FormData()

                    // 상품 데이터를 JSON으로 추가
                    formData.append('product', new Blob([JSON.stringify(productData)], {
                        type: 'application/json'
                    }))

                    // 이미지 파일들 추가
                    images.forEach((image, index) => {
                        formData.append('images', image)
                    })

                    const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}/products`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.token}`
                        },
                        body: formData
                    })

                    const newProduct = response.data || response
                    this.products.unshift(newProduct)
                    return newProduct
                } else {
                    // 이미지가 없는 경우 JSON으로 전송
                    const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}/products`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                            'Content-Type': 'application/json'
                        },
                        body: productData
                    })

                    const newProduct = response.data || response
                    this.products.unshift(newProduct)
                    return newProduct
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateProduct(shopId, productId, productData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: productData
                })

                const updatedProduct = response.data || response
                const index = this.products.findIndex(p => p.id === productId)
                if (index !== -1) {
                    this.products[index] = updatedProduct
                }
                if (this.currentProduct?.id === productId) {
                    this.currentProduct = updatedProduct
                }
                return updatedProduct
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteProduct(shopId, productId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.products = this.products.filter(p => p.id !== productId)
                if (this.currentProduct?.id === productId) {
                    this.currentProduct = null
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async searchProducts(keyword, page = 0, size = 10) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({
                    keyword,
                    page,
                    size
                })

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/search?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.products = response.data?.content || response.content || response.data || response
                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async getFeaturedProducts(page = 0, size = 10) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({ page, size })

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/featured?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.products = response.data?.content || response.content || response.data || response
                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 리뷰 관련 메서드들
        async fetchReviews(productId, page = 0, size = 10) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({ page, size })

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.reviews = response.data?.content || response.content || response.data || response
                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async createReview(productId, reviewData, images = []) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                let response
                if (images && images.length > 0) {
                    const formData = new FormData()
                    formData.append('review', new Blob([JSON.stringify(reviewData)], {
                        type: 'application/json'
                    }))
                    images.forEach((image) => {
                        formData.append('images', image)
                    })

                    response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.token}`
                        },
                        body: formData
                    })
                } else {
                    response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                            'Content-Type': 'application/json'
                        },
                        body: reviewData
                    })
                }

                const newReview = response.data || response
                this.reviews.unshift(newReview)
                return newReview
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateReview(productId, reviewId, reviewData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews/${reviewId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: reviewData
                })

                const updatedReview = response.data || response
                const index = this.reviews.findIndex(r => r.id === reviewId)
                if (index !== -1) {
                    this.reviews[index] = updatedReview
                }
                return updatedReview
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteReview(productId, reviewId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.reviews = this.reviews.filter(r => r.id !== reviewId)
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async toggleReviewHelpful(productId, reviewId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/products/${productId}/reviews/${reviewId}/helpful`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                // 리뷰 목록 새로고침 또는 해당 리뷰만 업데이트
                const index = this.reviews.findIndex(r => r.id === reviewId)
                if (index !== -1 && response.data) {
                    this.reviews[index] = response.data
                }

                return response.data || response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})