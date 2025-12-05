import { useAuthStore } from '../store/AuthStore.tsx'
import { useNotificationStore } from '../store/NotificationStore.tsx' // Добавляем импорт
import './styles/LogoutButton.css'

const LogoutButton = () => {
    const logout = useAuthStore(state => state.logout)
    const { showNotification } = useNotificationStore() // Используем стор
    
    const handleLogout = () => {
        // Вместо window.confirm используем наше уведомление
        showNotification(
            'auth', // variant: auth
            '⚠️ ВЫЙТИ ИЗ СИСТЕМЫ?', // message
            'warning', // type: warning
            10000, // duration: 10 секунд на подтверждение
            [ // actions: кнопки подтверждения/отмены
                {
                    label: 'ПОДТВЕРДИТЬ ВЫХОД',
                    onClick: () => {
                        logout();
                        // Уведомление об успешном выходе
                        showNotification('auth', '🚪 ВЫХОД ВЫПОЛНЕН', 'success', 3000);
                    },
                    type: 'primary' as const
                },
                {
                    label: 'ОСТАТЬСЯ',
                    onClick: () => {
                        // Уведомление об отмене выхода
                        showNotification('auth', '👨‍💻 СЕАНС ПРОДОЛЖЕН', 'info', 2000);
                    },
                    type: 'secondary' as const
                }
            ]
        );
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