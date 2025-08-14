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
                const { post } = useApi()

                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', folder)

                // Authorization 헤더 필수 (파일 업로드는 인증 필요)
                const response = await post('/admin/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
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
                const { del } = useApi()

                // Authorization 헤더 필수
                await del(`/admin/files/${fileId}`)
            } catch (error) {
                throw error
            }
        }
    }
})