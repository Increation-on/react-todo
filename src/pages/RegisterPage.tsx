// /src/pages/RegisterPage.tsx - ОБНОВЛЯЕМ
import { useState } from 'react';
import { useAuthStore } from '../store/AuthStore.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { useValidation } from '../hooks/auth/useValidation.tsx';
import './../styles/RegisterPage.css'

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState('');
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  
  // 🔥 ИСПОЛЬЗУЕМ ХУК ВАЛИДАЦИИ
  const { errors, validateRegisterForm, clearErrors } = useValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    clearErrors();
    
    // 🔥 ВАЛИДАЦИЯ РЕГИСТРАЦИИ
    if (!validateRegisterForm(email, password, confirmPassword)) {
      return;
    }
    
    try {
      const success = register(email, password);
      
      if (!success) {
        setSubmitError('Пользователь с таким email уже существует');
        return;
      }
      
      navigate('/'); // Редирект на главную после успешной регистрации
      
    } catch (err) {
      setSubmitError('Ошибка регистрации');
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <h2>Register</h2>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
            autoComplete="email"
            className={errors.email ? 'error-field' : ''}
          />
          {errors.email && (
            <div style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>
        
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="new-password"
            className={errors.password ? 'error-field' : ''}
          />
          {errors.password && (
            <div style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>
        
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Passwrod"
            required
            autoComplete="new-password"
            className={errors.confirmPassword ? 'error-field' : ''}
          />
          {errors.confirmPassword && (
            <div style={{ color: '#d32f2f', fontSize: '0.9em', marginTop: '5px' }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>
        
        <button type="submit">Register</button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;