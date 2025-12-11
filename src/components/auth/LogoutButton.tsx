import { useAuthStore } from '../../store/AuthStore.tsx'
import { useNotificationStore } from '../../store/NotificationStore.tsx'
import './../../styles/LogoutButton.css'
import { useState, useEffect } from 'react'

interface LogoutButtonProps {
  compact?: boolean; // Новый пропс для компактного вида
}

const LogoutButton = ({ compact = false }: LogoutButtonProps) => {
    const logout = useAuthStore(state => state.logout)
    const { showNotification } = useNotificationStore()
    
    // Определяем, мобильный ли экран
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    const handleLogout = () => {
        showNotification(
            'auth',
            '⚠️ ВЫЙТИ ИЗ СИСТЕМЫ?',
            'warning',
            10000,
            [
                {
                    label: 'ПОДТВЕРДИТЬ ВЫХОД',
                    onClick: () => {
                        logout();
                        showNotification('auth', '🚪 ВЫХОД ВЫПОЛНЕН', 'success', 3000);
                    },
                    type: 'primary' as const
                },
                {
                    label: 'ОСТАТЬСЯ',
                    onClick: () => {
                        showNotification('auth', '👨‍💻 СЕАНС ПРОДОЛЖЕН', 'info', 2000);
                    },
                    type: 'secondary' as const
                }
            ]
        );
    }
    
    return (
        <button 
            className={`logout-button ${compact ? 'compact' : ''}`}
            onClick={handleLogout}
            aria-label="Logout"
            title={compact ? 'Выйти' : 'Выйти из системы'}
        >
            <span className="logout-icon">🚪</span>
            {!compact && (
                <span className="logout-text">
                    {isMobile ? 'Exit' : 'Exit System'}
                </span>
            )}
        </button>
    )
}

export default LogoutButton