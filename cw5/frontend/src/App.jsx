import { useMemo, useState } from "react";
import Produkty from "./components/Produkty";
import Koszyk from "./components/Koszyk";
import Platnosci from "./components/Platnosci";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function App() {
  const [produkty, setProdukty] = useState([]);
  const [koszykItems, setKoszykItems] = useState([]);

  const koszykTotal = useMemo(() => {
    return koszykItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [koszykItems]);

  const addToCart = (product) => {
    setKoszykItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, price: Number(product.price), quantity: 1 }
      ];
    });
  };

  return (
    <main className="container">
      <h1>Sklep internetowy</h1>
      <p className="subtitle">React Hooks + Kotlin backend</p>

      <div className="grid">
        <Produkty apiUrl={API_URL} produkty={produkty} setProdukty={setProdukty} onAdd={addToCart} />
        <Koszyk apiUrl={API_URL} items={koszykItems} total={koszykTotal} />
        <Platnosci apiUrl={API_URL} total={koszykTotal} />
      </div>
    </main>
  );
}

export default App;
