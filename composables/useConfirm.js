export const useConfirm = () => {
    const isOpen = ref(false)
    const resolvePromise = ref(null)

    const confirmData = reactive({
        title: '확인',
        message: '',
        confirmText: '확인',
        cancelText: '취소'
    })

    const confirm = (options) => {
        return new Promise((resolve) => {
            Object.assign(confirmData, {
                title: options.title || '확인',
                message: options.message || '',
                confirmText: options.confirmText || '확인',
                cancelText: options.cancelText || '취소'
            })

            resolvePromise.value = resolve
            isOpen.value = true
        })
    }

    const handleConfirm = () => {
        resolvePromise.value?.(true)
        isOpen.value = false
    }

    const handleCancel = () => {
        resolvePromise.value?.(false)
        isOpen.value = false
    }

    return {
        isOpen: readonly(isOpen),
        confirmData: readonly(confirmData),
        confirm,
        handleConfirm,
        handleCancel
    }
}