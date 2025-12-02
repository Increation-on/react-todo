// /src/hooks/useValidation.tsx
import { useState, useCallback } from 'react'
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from '../utils/validation/field-validators.tsx'

export const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateLoginForm = useCallback((email: string, password: string) => {
    const newErrors: Record<string, string> = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Пароль обязателен'
    } else if (!validatePassword(password)) {
      newErrors.password = 'Пароль: минимум 6 символов, буквы и цифры'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])
  
  const validateRegisterForm = useCallback((
    email: string, 
    password: string, 
    confirmPassword: string
  ) => {
    const newErrors: Record<string, string> = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Пароль обязателен'
    } else if (!validatePassword(password)) {
      newErrors.password = 'Пароль: минимум 6 символов, буквы и цифры'
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (!validateConfirmPassword(password, confirmPassword)) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])
  
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])
  
  return {
    errors,
    validateLoginForm,
    validateRegisterForm,
    clearErrors
  }
}