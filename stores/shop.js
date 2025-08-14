import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
    state: () => ({
        shops: [],
        currentShop: null,
        loading: false,
        error: null,
        pagination: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
        }
    }),

    actions: {
        async fetchShops(params = {}) {
            this.loading = true
            this.error = null
            try {
                // Authorization이 필요하므로 get 메서드 사용 (getOptional이 아님)
                const { get } = useApi()

                const queryParams = {
                    page: params.page || 0,
                    size: params.size || 12,
                    ...params
                }

                // search 파라미터가 있으면 추가
                if (params.search && params.search.trim()) {
                    queryParams.search = params.search.trim()
                }

                // 정렬 파라미터가 있으면 추가
                if (params.sort) {
                    queryParams.sort = params.sort
                }

                console.log('Fetching shops with params:', queryParams)
                console.log('Request will be sent to: /v1/shops')

                // Authorization 헤더가 포함된 get 메서드 사용
                const response = await get('/v1/shops', { params: queryParams })

                console.log('Shop fetch response:', response)

                if (response.success) {
                    if (response.data.content) {
                        // 페이지네이션이 있는 경우
                        this.shops = response.data.content
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
                        this.shops = response.data
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
                    throw new Error(response.message || '브랜드 목록 조회에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('브랜드 목록 조회 실패 상세:', {
                    error: error,
                    message: error.message,
                    data: error.data,
                    status: error.status,
                    statusText: error.statusText
                })
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchShopById(shopId) {
            this.loading = true
            this.error = null
            try {
                // Authorization이 필요할 수 있으므로 get 사용
                const { get } = useApi()

                console.log('Fetching shop by ID:', shopId)

                const response = await get(`/v1/shops/${shopId}`)

                if (response.success) {
                    this.currentShop = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '브랜드 정보 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('브랜드 정보 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createShop(shopData) {
            this.loading = true
            this.error = null
            try {
                const { post } = useApi()

                // Authorization 헤더 필수
                const response = await post('/v1/shops', shopData)

                if (response.success) {
                    // 새로 생성된 브랜드를 목록 맨 앞에 추가
                    this.shops.unshift(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '브랜드 생성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('브랜드 생성 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateShop(shopId, shopData) {
            this.loading = true
            this.error = null
            try {
                const { put } = useApi()

                // Authorization 헤더 필수
                const response = await put(`/v1/shops/${shopId}`, shopData)

                if (response.success) {
                    // 목록에서 해당 브랜드 업데이트
                    const index = this.shops.findIndex(shop => shop.id === shopId)
                    if (index !== -1) {
                        this.shops[index] = response.data
                    }

                    // 현재 선택된 브랜드이면 업데이트
                    if (this.currentShop?.id === shopId) {
                        this.currentShop = response.data
                    }

                    return response.data
                } else {
                    throw new Error(response.message || '브랜드 정보 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('브랜드 정보 수정 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getMyShops() {
            this.loading = true
            this.error = null
            try {
                const { get } = useApi()

                // Authorization 헤더 필수
                const response = await get('/v1/shops/my')

                if (response.success) {
                    this.shops = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '내 브랜드 목록 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('내 브랜드 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 나머지 메서드들...

        clearError() {
            this.error = null
        },

        clearCurrentShop() {
            this.currentShop = null
        }
    }
})