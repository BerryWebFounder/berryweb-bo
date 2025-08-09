export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const validatePassword = (password) => {
    // 최소 8자, 하나 이상의 문자와 숫자
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(password)
}

export const validatePhone = (phone) => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    return phoneRegex.test(phone)
}

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value !== ''
}

export const validateMinLength = (value, minLength) => {
    return value && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
    return !value || value.length <= maxLength
}

export const validateNumber = (value) => {
    return !isNaN(value) && isFinite(value)
}

export const validatePositiveNumber = (value) => {
    return validateNumber(value) && value > 0
}

export const validateUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}