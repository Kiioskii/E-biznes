import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <h1>Panel użytkownika</h1>
      <p>Witaj, {user?.email}! To jest chroniona strona.</p>
      <div className="dashboard-card">
        <h2>Status sesji</h2>
        <p>Jesteś zalogowany przez serwer aplikacji (bez OAuth).</p>
      </div>
    </section>
  );
}
