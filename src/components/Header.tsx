// src/components/Header/Header.tsx
import { useAuthStore } from '../store/AuthStore.tsx'
import LogoutButton from './LogoutButton.tsx'
import './styles/Header.css'

const Header: React.FC = () => {
    const token = useAuthStore(state => state.token)
    const getCurrentUser = useAuthStore(state => state.getCurrentUser)
    const currentUser = getCurrentUser()

    if (!token) return null // Не показываем хедер если не авторизован

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="app-title">
                    <span className="title-glitch">React To-Do</span>
                </h1>
            </div>

            <div className="header-center">
                <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="user-email">{currentUser?.email || 'user@example.com'}</span>
                    <div className="connection-status">
                        <span className="status-dot"></span>
                        <span className="status-text">Online</span>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <LogoutButton />
            </div>
        </header>
    )
}

export default Header