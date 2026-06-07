import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { register } = useAuth();
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
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      setSubmitting(false);
      return;
    }

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Zarejestruj się</h1>
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
            minLength={6}
            required
          />
        </label>
        <label>
          Potwierdź hasło
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={submitting}
        >
          {submitting ? 'Tworzenie konta...' : 'Utwórz konto'}
        </button>
      </form>
      <p className="auth-footer">
        Masz już konto? <Link to="/sign-in">Zaloguj się</Link>
      </p>
    </section>
  );
}
