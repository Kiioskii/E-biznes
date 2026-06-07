import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      return;
    }

    if (!token) {
      setError('Brak tokenu autoryzacji');
      return;
    }

    completeOAuthLogin(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((err) => setError(err.message));
  }, [searchParams, completeOAuthLogin, navigate]);

  if (error) {
    return (
      <section className="auth-card">
        <h1>Logowanie nie powiodło się</h1>
        <p className="auth-error">{error}</p>
        <p className="auth-footer">
          <Link to="/sign-in">Wróć do logowania</Link>
        </p>
      </section>
    );
  }

  return <p className="loading">Logowanie przez Google...</p>;
}
