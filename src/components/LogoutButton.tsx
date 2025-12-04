// components/LogoutButton.tsx - обновленная версия
import { useAuthStore } from '../store/AuthStore.tsx'
import './styles/LogoutButton.css'

const LogoutButton = () => {
    const logout = useAuthStore(state => state.logout)
    
    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            logout()
        }
    }
    
    return (
        <button 
            className="logout-button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
        >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Exit System</span>
        </button>
    )
}

export default LogoutButton