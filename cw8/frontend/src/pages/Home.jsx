import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <h1>Witaj w aplikacji</h1>
      <p className="hero-text">
        Prosta aplikacja z React i Express. Zaloguj się lub utwórz konto, aby
        przejść do panelu użytkownika.
      </p>
      <div className="hero-actions">
        <Link to="/sign-in" className="btn btn-secondary">
          Zaloguj się
        </Link>
        <Link to="/sign-up" className="btn btn-primary">
          Zarejestruj się
        </Link>
      </div>
    </section>
  );
}
