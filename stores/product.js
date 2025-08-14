import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        reviews: [],
        currentProduct: null,
        loading: false,
        error: null,
        pagination: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
        },
        reviewsPagination: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
        }
    }),

    actions: {
        async fetchProducts(shopId, params = {}) {
            this.loading = true
            this.error = null
            try {
                const { getOptional } = useApi()

                const queryParams = {
                    page: params.page || 0,
                    size: params.size || 10,
                    ...params
                }

                // search 파라미터가 있으면 추가
                if (params.search && params.search.trim()) {
                    queryParams.search = params.search.trim()
                }

                // 상태 필터가 있으면 추가
                if (params.status) {
                    queryParams.status = params.status
                }

                // 정렬 파라미터가 있으면 추가
                if (params.sort) {
                    queryParams.sort = params.sort
                }

                // Authorization 헤더는 선택사항 (public endpoint)
                const response = await getOptional(`/v1/shops/${shopId}/products`, { params: queryParams })

                if (response.success) {
                    if (response.data.content) {
                        // 페이지네이션이 있는 경우
                        this.products = response.data.content
                        this.pagination = {
                            page: response.data.number,
                            size: response.data.size,
                            totalElements: response.data.totalElements,
                            totalPages: response.data.totalPages,
                            first: response.data.first,
                            last: response.data.last
                        }
                    } else {
                        // 일반 배열인 경우
                        this.products = response.data
                        this.pagination = {
                            page: 0,
                            size: response.data.length,
                            totalElements: response.data.length,
                            totalPages: 1,
                            first: true,
                            last: true
                        }
                    }
                } else {
                    throw new Error(response.message || '상품 목록 조회에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상품 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchProductById(productId) {
            this.loading = true
            this.error = null
            try {
                const { getOptional } = useApi()

                // Authorization 헤더는 선택사항 (public endpoint)
                const response = await getOptional(`/v1/products/${productId}`)

                if (response.success) {
                    this.currentProduct = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '상품 정보 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상품 정보 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createProduct(shopId, productData, images = []) {
            this.loading = true
            this.error = null
            try {
                const { post } = useApi()

                // Authorization 헤더 필수
                let response
                if (images && images.length > 0) {
                    const formData = new FormData()

                    // 상품 데이터를 JSON으로 추가
                    formData.append('product', new Blob([JSON.stringify(productData)], {
                        type: 'application/json'
                    }))

                    // 이미지 파일들 추가
                    images.forEach((image) => {
                        formData.append('images', image)
                    })

                    response = await post(`/v1/shops/${shopId}/products`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                } else {
                    // 이미지가 없는 경우 JSON으로 전송
                    response = await post(`/v1/shops/${shopId}/products`, productData)
                }

                if (response.success) {
                    this.products.unshift(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '상품 생성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상품 생성 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateProduct(shopId, productId, productData) {
            this.loading = true
            this.error = null
            try {
                const { put } = useApi()

                // Authorization 헤더 필수 (인증된 사용자만 수정 가능)
                const response = await put(`/v1/shops/${shopId}/products/${productId}`, productData)

                if (response.success) {
                    // 목록에서 해당 상품 업데이트
                    const index = this.products.findIndex(p => p.id === productId)
                    if (index !== -1) {
                        this.products[index] = response.data
                    }

                    // 현재 선택된 상품이면 업데이트
                    if (this.currentProduct?.id === productId) {
                        this.currentProduct = response.data
                    }

                    return response.data
                } else {
                    throw new Error(response.message || '상품 정보 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상품 정보 수정 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteProduct(shopId, productId) {
            this.loading = true
            this.error = null
            try {
                // 실제로는 상품을 DISCONTINUED 상태로 변경
                const product = this.products.find(p => p.id === productId)
                if (!product) {
                    throw new Error('상품을 찾을 수 없습니다.')
                }

                const response = await this.updateProduct(shopId, productId, {
                    ...product,
                    status: 'DISCONTINUED'
                })

                // 목록에서 제거
                this.products = this.products.filter(p => p.id !== productId)

                // 현재 선택된 상품이면 클리어
                if (this.currentProduct?.id === productId) {
                    this.currentProduct = null
                }

                return response
            } catch (error) {
                console.error('상품 삭제 실패:', error)
                throw error
            }
        },

        async searchProducts(keyword, params = {}) {
            this.loading = true
            this.error = null
            try {
                const { getOptional } = useApi()

                const queryParams = {
                    keyword,
                    page: params.page || 0,
                    size: params.size || 10,
                    ...params
                }

                // Authorization 헤더는 선택사항 (public endpoint)
                const response = await getOptional('/v1/products/search', { params: queryParams })

                if (response.success) {
                    if (response.data.content) {
                        this.products = response.data.content
                        this.pagination = {
                            page: response.data.number,
                            size: response.data.size,
                            totalElements: response.data.totalElements,
                            totalPages: response.data.totalPages,
                            first: response.data.first,
                            last: response.data.last
                        }
                    } else {
                        this.products = response.data
                    }
                } else {
                    throw new Error(response.message || '상품 검색에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상품 검색 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getFeaturedProducts(params = {}) {
            this.loading = true
            this.error = null
            try {
                const { getOptional } = useApi()

                const queryParams = {
                    page: params.page || 0,
                    size: params.size || 10,
                    ...params
                }

                // Authorization 헤더는 선택사항 (public endpoint)
                const response = await getOptional('/v1/products/featured', { params: queryParams })

                if (response.success) {
                    if (response.data.content) {
                        this.products = response.data.content
                        this.pagination = {
                            page: response.data.number,
                            size: response.data.size,
                            totalElements: response.data.totalElements,
                            totalPages: response.data.totalPages,
                            first: response.data.first,
                            last: response.data.last
                        }
                    } else {
                        this.products = response.data
                    }
                } else {
                    throw new Error(response.message || '추천 상품 조회에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('추천 상품 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 리뷰 관련 메서드들
        async fetchReviews(productId, params = {}) {
            this.loading = true
            this.error = null
            try {
                const { get } = useApi()

                const queryParams = {
                    page: params.page || 0,
                    size: params.size || 10,
                    ...params
                }

                // Authorization 헤더 필수 (리뷰 조회는 인증 필요)
                const response = await get(`/v1/products/${productId}/reviews`, { params: queryParams })

                if (response.success) {
                    if (response.data.content) {
                        this.reviews = response.data.content
                        this.reviewsPagination = {
                            page: response.data.number,
                            size: response.data.size,
                            totalElements: response.data.totalElements,
                            totalPages: response.data.totalPages,
                            first: response.data.first,
                            last: response.data.last
                        }
                    } else {
                        this.reviews = response.data
                    }
                } else {
                    throw new Error(response.message || '리뷰 목록 조회에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('리뷰 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createReview(productId, reviewData, images = []) {
            this.loading = true
            this.error = null
            try {
                const { post } = useApi()

                // Authorization 헤더 필수
                let response
                if (images && images.length > 0) {
                    const formData = new FormData()
                    formData.append('review', new Blob([JSON.stringify(reviewData)], {
                        type: 'application/json'
                    }))
                    images.forEach((image) => {
                        formData.append('images', image)
                    })

                    response = await post(`/v1/products/${productId}/reviews`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                } else {
                    response = await post(`/v1/products/${productId}/reviews`, reviewData)
                }

                if (response.success) {
                    this.reviews.unshift(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '리뷰 작성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('리뷰 작성 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateReview(productId, reviewId, reviewData) {
            this.loading = true
            this.error = null
            try {
                const { put } = useApi()

                // Authorization 헤더 필수
                const response = await put(`/v1/products/${productId}/reviews/${reviewId}`, reviewData)

                if (response.success) {
                    const index = this.reviews.findIndex(r => r.id === reviewId)
                    if (index !== -1) {
                        this.reviews[index] = response.data
                    }
                    return response.data
                } else {
                    throw new Error(response.message || '리뷰 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('리뷰 수정 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteReview(productId, reviewId) {
            this.loading = true
            this.error = null
            try {
                const { del } = useApi()

                // Authorization 헤더 필수
                const response = await del(`/v1/products/${productId}/reviews/${reviewId}`)

                if (response.success) {
                    this.reviews = this.reviews.filter(r => r.id !== reviewId)
                } else {
                    throw new Error(response.message || '리뷰 삭제에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('리뷰 삭제 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async toggleReviewHelpful(productId, reviewId) {
            this.loading = true
            this.error = null
            try {
                const { post } = useApi()

                // Authorization 헤더 필수
                const response = await post(`/v1/products/${productId}/reviews/${reviewId}/helpful`)

                if (response.success) {
                    // 리뷰 목록 새로고침 또는 해당 리뷰만 업데이트
                    const index = this.reviews.findIndex(r => r.id === reviewId)
                    if (index !== -1 && response.data) {
                        this.reviews[index] = response.data
                    }
                    return response.data
                } else {
                    throw new Error(response.message || '도움됨 처리에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('도움됨 처리 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 상태 초기화
        clearError() {
            this.error = null
        },

        clearCurrentProduct() {
            this.currentProduct = null
        },

        clearProducts() {
            this.products = []
            this.pagination = {
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: true
            }
        },

        clearReviews() {
            this.reviews = []
            this.reviewsPagination = {
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: true
            }
        }
    }
})