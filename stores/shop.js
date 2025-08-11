import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
    state: () => ({
        shops: [],
        currentShop: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchShops(params = {}) {
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

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                // 백엔드 응답 구조에 맞게 수정
                this.shops = response.data?.content || response.content || response.data || response
                return response
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async getShopById(shopId) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.currentShop = response.data || response
                return this.currentShop
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async createShop(shopData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: shopData
                })

                const newShop = response.data || response
                this.shops.unshift(newShop)
                return newShop
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateShop(shopId, shopData) {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops/${shopId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: shopData
                })

                const updatedShop = response.data || response
                const index = this.shops.findIndex(shop => shop.id === shopId)
                if (index !== -1) {
                    this.shops[index] = updatedShop
                }
                if (this.currentShop?.id === shopId) {
                    this.currentShop = updatedShop
                }
                return updatedShop
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async getMyShops() {
            this.loading = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/v1/shops/my`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.shops = response.data || response
                return this.shops
            } catch (error) {
                this.error = error.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async searchShops(keyword, page = 0, size = 10) {
            return await this.fetchShops({ search: keyword, page, size })
        }
    }
})