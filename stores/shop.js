import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
    state: () => ({
        shops: [],
        currentShop: null,
        products: [],
        categories: [],
        reviews: [],
        loading: false
    }),

    actions: {
        async fetchShops() {
            this.loading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.shops = await $fetch(`${config.public.apiBase}/admin/shops`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async createShop(shopData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const newShop = await $fetch(`${config.public.apiBase}/admin/shops`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: shopData
                })

                this.shops.push(newShop)
                return newShop
            } catch (error) {
                throw error
            }
        },

        async updateShopStatus(shopId, status) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const updatedShop = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/status`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: { status }
                })

                const index = this.shops.findIndex(shop => shop.id === shopId)
                if (index !== -1) {
                    this.shops[index] = updatedShop
                }

                return updatedShop
            } catch (error) {
                throw error
            }
        },

        async fetchProducts(shopId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.products = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            }
        }
    }
})