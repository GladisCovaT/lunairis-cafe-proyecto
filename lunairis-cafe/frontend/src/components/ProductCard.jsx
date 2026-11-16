import { useReveal } from '../hooks/useReveal';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product, onAdd, onRemove, quantity = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <article ref={ref} className={`product-card reveal${visible ? ' visible' : ''}`}>
      <img src={product.image} alt={product.alt} />
      <div className="product-info">
        <span>{product.label}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{formatPrice(product.price)}</strong>
          
          {quantity > 0 ? (
            <div className="counter-wrapper">
              <button className="btn-qty" onClick={() => onRemove(product.id)}>-</button>
              <span className="qty-number">{quantity}</span>
              <button className="btn-qty" onClick={() => onAdd(product)}>+</button>
            </div>
          ) : (
            <button className="add-cart" onClick={() => onAdd(product)}>+</button>
          )}
        </div>
      </div>
    </article>
  );
}