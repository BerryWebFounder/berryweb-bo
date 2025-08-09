import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        categories: [],
        productOptions: [],
        reviews: [],
        currentProduct: null,
        loading: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0
        }
    }),

    actions: {
        async fetchProducts(shopId, params = {}) {
            this.loading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams({
                    page: this.pagination.page,
                    limit: this.pagination.limit,
                    ...params
                })

                const response = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.products = response.data
                this.pagination.total = response.total
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async createProduct(shopId, productData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const newProduct = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: productData
                })

                this.products.unshift(newProduct)
                return newProduct
            } catch (error) {
                throw error
            }
        },

        async updateProduct(shopId, productId, productData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const updatedProduct = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: productData
                })

                const index = this.products.findIndex(p => p.id === productId)
                if (index !== -1) {
                    this.products[index] = updatedProduct
                }

                return updatedProduct
            } catch (error) {
                throw error
            }
        },

        async deleteProduct(shopId, productId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })

                this.products = this.products.filter(p => p.id !== productId)
            } catch (error) {
                throw error
            }
        },

        async fetchCategories(shopId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.categories = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/categories`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            }
        },

        async createCategory(shopId, categoryData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const newCategory = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: categoryData
                })

                this.categories.push(newCategory)
                return newCategory
            } catch (error) {
                throw error
            }
        },

        async fetchProductOptions(productId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.productOptions = await $fetch(`${config.public.apiBase}/admin/products/${productId}/options`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            }
        },

        async createProductOption(productId, optionData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const newOption = await $fetch(`${config.public.apiBase}/admin/products/${productId}/options`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: optionData
                })

                this.productOptions.push(newOption)
                return newOption
            } catch (error) {
                throw error
            }
        },

        async fetchReviews(shopId, params = {}) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const queryParams = new URLSearchParams(params)

                this.reviews = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/reviews?${queryParams}`, {
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