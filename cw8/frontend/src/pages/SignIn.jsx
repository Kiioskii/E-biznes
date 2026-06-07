import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Zaloguj się</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="twoj@email.com"
            required
          />
        </label>
        <label>
          Hasło
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={submitting}
        >
          {submitting ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
      <p className="auth-footer">
        Nie masz konta? <Link to="/sign-up">Zarejestruj się</Link>
      </p>
    </section>
  );
}
