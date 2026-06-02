import { useEffect, useState } from "react";

function Produkty({ apiUrl, produkty, setProdukty, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) {
        throw new Error("Nie udalo sie pobrac produktow.");
      }
      const data = await res.json();
      setProdukty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="card">
      <h2>Produkty</h2>
      <button onClick={fetchProducts} className="btn-secondary">Odswiez</button>

      {loading && <p>Ladowanie...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {produkty.map((produkt) => (
          <li key={produkt.id} className="item">
            <div>
              <strong>{produkt.name}</strong>
              <p>{produkt.description}</p>
              <small>{produkt.price} PLN</small>
            </div>
            <button className="btn-primary" onClick={() => onAdd(produkt)}>
              Dodaj
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Produkty;
