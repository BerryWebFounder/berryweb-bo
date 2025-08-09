import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', {
    state: () => ({
        uploadProgress: 0,
        uploading: false
    }),

    actions: {
        async uploadFile(file, folder = 'general') {
            this.uploading = true
            this.uploadProgress = 0

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', folder)

                const response = await $fetch(`${config.public.apiBase}/admin/files/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: formData,
                    onUploadProgress: (progress) => {
                        this.uploadProgress = Math.round((progress.loaded * 100) / progress.total)
                    }
                })

                return response
            } catch (error) {
                throw error
            } finally {
                this.uploading = false
                this.uploadProgress = 0
            }
        },

        async deleteFile(fileId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                await $fetch(`${config.public.apiBase}/admin/files/${fileId}`, {
                    method: 'DELETE',
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