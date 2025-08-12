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
                const { $api } = useNuxtApp()

                const queryParams = {
                    page: params.page || 0,
                    size: params.size || 10,
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

                // 활성 상태 필터가 있으면 추가
                if (params.isActive !== undefined && params.isActive !== '') {
                    queryParams.isActive = params.isActive
                }

                const response = await $api.get('/api/v1/shops', { params: queryParams })

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
                    throw new Error(response.message || '상점 목록 조회에 실패했습니다.')
                }

                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상점 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchShopById(shopId) {
            this.loading = true
            this.error = null
            try {
                const { $api } = useNuxtApp()

                const response = await $api.get(`/api/v1/shops/${shopId}`)

                if (response.success) {
                    this.currentShop = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '상점 정보 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상점 정보 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createShop(shopData) {
            this.loading = true
            this.error = null
            try {
                const { $api } = useNuxtApp()

                const response = await $api.post('/api/v1/shops', shopData)

                if (response.success) {
                    // 새로 생성된 상점을 목록 맨 앞에 추가
                    this.shops.unshift(response.data)
                    return response.data
                } else {
                    throw new Error(response.message || '상점 생성에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상점 생성 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateShop(shopId, shopData) {
            this.loading = true
            this.error = null
            try {
                const { $api } = useNuxtApp()

                const response = await $api.put(`/api/v1/shops/${shopId}`, shopData)

                if (response.success) {
                    // 목록에서 해당 상점 업데이트
                    const index = this.shops.findIndex(shop => shop.id === shopId)
                    if (index !== -1) {
                        this.shops[index] = response.data
                    }

                    // 현재 선택된 상점이면 업데이트
                    if (this.currentShop?.id === shopId) {
                        this.currentShop = response.data
                    }

                    return response.data
                } else {
                    throw new Error(response.message || '상점 정보 수정에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('상점 정보 수정 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getMyShops() {
            this.loading = true
            this.error = null
            try {
                const { $api } = useNuxtApp()

                const response = await $api.get('/api/v1/shops/my')

                if (response.success) {
                    this.shops = response.data
                    return response.data
                } else {
                    throw new Error(response.message || '내 상점 목록 조회에 실패했습니다.')
                }
            } catch (error) {
                this.error = error.data?.message || error.message
                console.error('내 상점 목록 조회 실패:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async searchShops(keyword, params = {}) {
            return await this.fetchShops({
                search: keyword,
                page: params.page || 0,
                size: params.size || 10,
                ...params
            })
        },

        // 상점 삭제 (비활성화)
        async deleteShop(shopId) {
            this.loading = true
            this.error = null
            try {
                const shop = this.shops.find(s => s.id === shopId)
                if (!shop) {
                    throw new Error('상점을 찾을 수 없습니다.')
                }

                // 상점을 비활성화
                const response = await this.updateShop(shopId, {
                    ...shop,
                    isActive: false
                })

                return response
            } catch (error) {
                console.error('상점 삭제 실패:', error)
                throw error
            }
        },

        // 상점 상태 토글
        async toggleShopStatus(shopId) {
            const shop = this.shops.find(s => s.id === shopId)
            if (!shop) {
                throw new Error('상점을 찾을 수 없습니다.')
            }

            return await this.updateShop(shopId, {
                ...shop,
                isActive: !shop.isActive
            })
        },

        // 상태 초기화
        clearError() {
            this.error = null
        },

        clearCurrentShop() {
            this.currentShop = null
        },

        // 통계 계산
        getStats() {
            const totalShops = this.shops.length
            const activeShops = this.shops.filter(shop => shop.isActive).length
            const totalProducts = this.shops.reduce((sum, shop) => sum + (shop.productCount || 0), 0)

            // 이번 달 생성된 상점 계산
            const thisMonth = new Date().getMonth()
            const thisYear = new Date().getFullYear()
            const newShopsThisMonth = this.shops.filter(shop => {
                const createdDate = new Date(shop.createdAt)
                return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
            }).length

            return {
                totalShops,
                activeShops,
                totalProducts,
                newShopsThisMonth,
                activeShopsPercent: totalShops > 0 ? Math.round((activeShops / totalShops) * 100) : 0,
                avgProductsPerShop: totalShops > 0 ? Math.round(totalProducts / totalShops) : 0
            }
        }
    }
})