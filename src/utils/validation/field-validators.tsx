// /src/utils/validation/field-validators.js

export const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
}

export const validatePassword = (password) => {
    const passwordRegex = /(?=.*[a-zA-Z])(?=.*\d).{6,}/
    return passwordRegex.test(password)
}

export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword
}