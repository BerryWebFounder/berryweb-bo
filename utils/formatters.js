export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount)
}

export const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number)
}

export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }

    return new Date(date).toLocaleDateString('ko-KR', { ...defaultOptions, ...options })
}

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('ko-KR')
}

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatRelativeTime = (date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}일 전`

    return formatDate(date)
}

export const truncateText = (text, length = 50) => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}