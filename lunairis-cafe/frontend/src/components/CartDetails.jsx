import { formatPrice } from '../utils/format';

export default function CartDetails({ items, total, hidden, onRemove }) {
  return (
    <div id="cartDetails" className="cart-details" hidden={hidden}>
      <h3>Tu pedido</h3>
      {items.map((item) => (
        <p key={item.id}>
          {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
          <button aria-label="Quitar producto" onClick={() => onRemove(item.id)}>−</button>
        </p>
      ))}
      <hr />
      <strong>Total: {formatPrice(total)}</strong>
      <p><small>Pedido de demostración. Confirma disponibilidad con el establecimiento.</small></p>
    </div>
  );
}
