import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <section className="auth-card">
      <h1>Zarejestruj się</h1>
      <p className="auth-subtitle">Obsługa rejestracji zostanie dodana później.</p>
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Email
          <input type="email" name="email" placeholder="twoj@email.com" />
        </label>
        <label>
          Hasło
          <input type="password" name="password" placeholder="••••••••" />
        </label>
        <label>
          Potwierdź hasło
          <input type="password" name="confirmPassword" placeholder="••••••••" />
        </label>
        <button type="submit" className="btn btn-primary btn-full">
          Utwórz konto
        </button>
      </form>
      <p className="auth-footer">
        Masz już konto? <Link to="/sign-in">Zaloguj się</Link>
      </p>
    </section>
  );
}
