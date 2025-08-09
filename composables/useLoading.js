export const useLoading = () => {
    const isLoading = ref(false)
    const message = ref('로딩 중...')

    const startLoading = (msg = '로딩 중...') => {
        message.value = msg
        isLoading.value = true
    }

    const stopLoading = () => {
        isLoading.value = false
        message.value = '로딩 중...'
    }

    const withLoading = async (asyncFn, msg) => {
        startLoading(msg)
        try {
            const result = await asyncFn()
            return result
        } finally {
            stopLoading()
        }
    }

    return {
        isLoading: readonly(isLoading),
        message: readonly(message),
        startLoading,
        stopLoading,
        withLoading
    }
}