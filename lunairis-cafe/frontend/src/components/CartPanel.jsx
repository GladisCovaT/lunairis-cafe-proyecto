import { formatPrice } from '../utils/format';

export default function CartPanel({ count, total, onToggleDetails }) {
  return (
    <div className="cart-panel">
      <div>
        <span>Tu selección</span>
        <h3><span id="cartCount">{count}</span> productos</h3>
      </div>
      <div>
        <strong id="cartTotal">{formatPrice(total)}</strong>
        <button className="btn-primary" id="viewCart" onClick={onToggleDetails}>Ver pedido</button>
      </div>
    </div>
  );
}
