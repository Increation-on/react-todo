import { useAuthStore } from '../../store/AuthStore.tsx'
import LogoutButton from '../auth/LogoutButton.tsx'
import './../../styles/Header.css'

// ДОБАВЛЯЕМ: пропс для класса
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
    const token = useAuthStore(state => state.token)
    const getCurrentUser = useAuthStore(state => state.getCurrentUser)
    const currentUser = getCurrentUser()

    if (!token) return null // Не показываем хедер если не авторизован

    return (
        // ИЗМЕНЕНИЕ: добавляем className к header
        <header className={`app-header ${className}`}>
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