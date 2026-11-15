import { useState } from 'react';
import { api } from '../../services/api';
import { useForm } from '../../hooks/useForm';

export default function LoginView({ onLogin }) {
  const { values, handleChange, reset } = useForm({ email: '', password: '' });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback('Verificando acceso…');
    try {
      const result = await api('/api/admin/login', { method: 'POST', body: JSON.stringify(values) });
      setFeedback('');
      reset();
      onLogin(result.email);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell" id="loginView">
      <div className="login-aside">
        <a className="admin-brand" href="/">
          <img src="/assets/logo.svg" alt="" width="48" height="48" />
          <span>Lunairis <em>Café</em></span>
        </a>
        <div>
          <p className="eyebrow">PANEL DE GESTIÓN</p>
          <h1>Detrás de cada pausa, hay un equipo que cuida.</h1>
          <p>Administra tu carta, acompaña a tu comunidad y observa cómo crece Lunairis.</p>
        </div>
        <span className="login-decoration">✳</span>
        <a className="back-link" href="/">← Volver al sitio</a>
      </div>

      <main className="login-main">
        <form className="login-card" id="loginForm" onSubmit={handleSubmit}>
          <div className="login-symbol">☾</div>
          <p className="eyebrow">ACCESO PRIVADO</p>
          <h2>Bienvenida de vuelta.</h2>
          <p className="login-subtitle">Ingresa tus credenciales para continuar.</p>

          <label>Correo administrador
            <input type="email" name="email" required autoComplete="username"
              placeholder="admin@lunairiscafe.com" value={values.email} onChange={handleChange} />
          </label>

          <label>Contraseña
            <input type="password" name="password" required autoComplete="current-password"
              placeholder="Tu contraseña" value={values.password} onChange={handleChange} />
          </label>

          <button className="admin-button primary full" type="submit" disabled={loading}>
            Entrar al panel <span>↗</span>
          </button>
          <p className="login-feedback" id="loginFeedback" role="status">{feedback}</p>
          <small>El acceso se configura desde el archivo <code>.env</code>.</small>
        </form>
      </main>
    </div>
  );
}
