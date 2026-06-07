import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const COMMANDS = [
  {
    name: "/chat",
    description: "Wyślij pytanie do ChatGPT",
    example: "/chat Jak działa Docker?",
    endpoint: "chat",
    label: "AI",
  },
  {
    name: "/discord",
    description: "Wyślij wiadomość lub komendę bota na Discord",
    example: "/discord !ping",
    endpoint: "discord",
    label: "Bot",
  },
];

const BOT_COMMANDS = [
  { cmd: "!ping", desc: "Bot odpowie: pong 🏓" },
  { cmd: "!kategorie", desc: "Lista kategorii produktów" },
  { cmd: "!produkty Sport", desc: "Produkty z wybranej kategorii" },
];

function parseCommand(text) {
  const trimmed = text.trim();

  for (const command of COMMANDS) {
    if (trimmed.toLowerCase().startsWith(`${command.name} `)) {
      const payload = trimmed.slice(command.name.length).trim();
      if (!payload) {
        return { error: `Podaj treść po komendzie, np. ${command.example}` };
      }
      return { endpoint: command.endpoint, payload, label: command.label };
    }
  }

  if (trimmed.startsWith("/")) {
    return {
      error: "Nieznana komenda. Użyj /chat lub /discord.",
    };
  }

  return { endpoint: "chat", payload: trimmed, label: "AI" };
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      label: "System",
      text: "Wybierz komendę z listy. Bot odpowiada na !ping, !kategorie i !produkty — z frontu i z Discorda.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function applyCommand(command) {
    setInput(`${command.name} `);
    setError("");
  }

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const parsed = parseCommand(text);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", label: "Ty", text }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${parsed.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: parsed.payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.reply || data.detail || "Nie udało się wysłać wiadomości.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: parsed.endpoint === "discord" ? "discord" : "assistant",
          label: parsed.label,
          text: data.reply,
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          label: parsed.label,
          text: "Przepraszam, wystąpił błąd po stronie serwera.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CW9 Chat</h1>
        <p>Frontend → Backend → Services (ChatGPT) / Discord</p>
      </header>

      <section className="commands">
        <h2>Dostępne komendy</h2>
        <ul className="commands-list">
          {COMMANDS.map((command) => (
            <li key={command.name} className="command-item">
              <button
                type="button"
                className="command-chip"
                onClick={() => applyCommand(command)}
                disabled={loading}
              >
                {command.name}
              </button>
              <div>
                <strong>{command.description}</strong>
                <p>{command.example}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="bot-commands">
          <h3>Komendy bota (Discord i /discord)</h3>
          <ul>
            {BOT_COMMANDS.map((item) => (
              <li key={item.cmd}>
                <button
                  type="button"
                  className="command-chip bot"
                  onClick={() => {
                    setInput(`/discord ${item.cmd}`);
                    setError("");
                  }}
                  disabled={loading}
                >
                  {item.cmd}
                </button>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="chat">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`bubble ${message.role}`}>
              <span className="label">{message.label || (message.role === "user" ? "Ty" : "AI")}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {loading && (
            <div className="bubble assistant">
              <span className="label">...</span>
              <p className="typing">Przetwarzam...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <p className="error">{error}</p>}

        <form className="composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="/chat pytanie... lub /discord !ping"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Wyślij
          </button>
        </form>
      </main>
    </div>
  );
}
