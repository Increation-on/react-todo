/**
 * 🎫 MOCK JWT ГЕНЕРАТОР И ПАРСЕР
 * ВАЖНО: Это учебная реализация, не используй в продакшене!
 */
export const createMockJWT = (payload) => {
  const encodedPayload = btoa(JSON.stringify(payload))
  return `mock-jwt.${encodedPayload}.fake-signature`
}

export const parseMockJWT = (token) => {
  try {
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}