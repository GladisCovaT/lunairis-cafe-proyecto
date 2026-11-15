import { useState } from 'react';

// Carrito de compras: lista de { id, name, price, quantity }
export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = ({ id, name, price }) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { id, name, price, quantity: 1 }];
    });
  };

  const removeOne = (id) => {
    setItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const count = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, count, total, addItem, removeOne };
}
