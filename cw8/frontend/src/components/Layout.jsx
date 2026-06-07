import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          App
        </Link>
        <nav className="nav">
          {loading ? null : isAuthenticated ? (
            <>
              <Link to="/dashboard">Panel</Link>
              <span className="nav-user">{user.email}</span>
              <button type="button" className="btn btn-secondary" onClick={logout}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in">Zaloguj się</Link>
              <Link to="/sign-up" className="btn btn-primary">
                Zarejestruj się
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
