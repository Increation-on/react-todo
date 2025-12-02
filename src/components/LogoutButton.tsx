// /src/components/LogoutButton.tsx (создаём)
import { useAuthStore } from "../store/AuthStore.tsx"

export const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout)
  
  return (
    <button onClick={logout} style={{ padding: '5px 10px' }}>
      Выйти
    </button>
  )
}