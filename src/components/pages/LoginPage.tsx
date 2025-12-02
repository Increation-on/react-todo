// /src/pages/LoginPage.tsx - ОБНОВЛЯЕМ
import { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore.tsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useValidation } from '../../hooks/useValidation.tsx';
import { useNotificationStore } from '../../store/NotificationStore.tsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState(''); // Для ошибок сервера
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const location = useLocation();

    const showNotification = useNotificationStore(state => state.showNotification);

    // 🔥 ИСПОЛЬЗУЕМ ХУК ВАЛИДАЦИИ
    const { errors, validateLoginForm, clearErrors } = useValidation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        clearErrors();

        // 🔥 ВАЛИДАЦИЯ
        if (!validateLoginForm(email, password)) {
            return; // Есть ошибки - не отправляем
        }

        try {
            const success = login(email, password);

            if (!success) {
                showNotification('auth', 'Неверный email или пароль', 'error');
                setSubmitError('Неверный email или пароль');
                return;
            }

            showNotification('auth', 'Вход выполнен успешно!', 'success');

            // Умный редирект
            const state = location.state as { from?: string } | undefined;
            const redirectPath = state?.from || '/';

            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 10);

        } catch (err) {
            setSubmitError('Ошибка входа. Попробуйте снова.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-page">
            <h2>Вход в систему</h2>

            {/* 🔥 ОШИБКИ СЕРВЕРА */}
            {submitError && (
                <div style={{
                    color: '#d32f2f',
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        autoFocus
                        className={errors.email ? 'error-field' : ''}
                    />
                    {/* 🔥 ОШИБКА EMAIL */}
                    {errors.email && (
                        <div style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '5px' }}>
                            {errors.email}
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        required
                        className={errors.password ? 'error-field' : ''}
                    />
                    {/* 🔥 ОШИБКА ПАРОЛЯ */}
                    {errors.password && (
                        <div style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '5px' }}>
                            {errors.password}
                        </div>
                    )}
                </div>

                <button type="submit">Войти</button>
            </form>

            <p style={{ marginTop: '20px' }}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default LoginPage;