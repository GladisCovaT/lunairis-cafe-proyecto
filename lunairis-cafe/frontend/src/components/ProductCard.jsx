import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product, onAdd }) {
  const [ref, visible] = useReveal();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  // Limpia el temporizador si la tarjeta desaparece antes de tiempo
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 700);
  };

  return (
    <article ref={ref} className={`product-card reveal${visible ? ' visible' : ''}`}>
      <img src={product.image} alt={product.alt} />
      <div className="product-info">
        <span>{product.label}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button className="add-cart" onClick={handleAdd}>{added ? '✓' : '+'}</button>
        </div>
      </div>
    </article>
  );
}
