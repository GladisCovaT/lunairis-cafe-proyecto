import { Fragment } from 'react';
import { orderStatuses } from '../../data/adminTabs';
import { formatDateTime, money } from '../../utils/format';

export default function OrdersTab({ active, orders, onStatusChange }) {
  const count = orders ? orders.length : 0;

  return (
    <section className={`admin-tab${active ? ' active' : ''}`} id="tab-orders">
      <div className="tab-intro">
        <div>
          <p className="eyebrow">PEDIDOS DE LA COMUNIDAD</p>
          <h2>Un pedido a la vez.</h2>
          <p>Consulta los detalles y actualiza el estado de preparación.</p>
        </div>
        <span className="panel-chip" id="ordersCountLabel">{count} pedidos</span>
      </div>

      <div className="panel-card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pedido</th><th>Persona</th><th>Detalle</th><th>Total</th><th>Estado</th>
              </tr>
            </thead>
            <tbody id="adminOrderRows">
              {orders === null && (
                <tr><td colSpan="5">Cargando pedidos…</td></tr>
              )}
              {orders !== null && orders.length === 0 && (
                <tr><td colSpan="5" className="table-empty">Aún no hay pedidos registrados.</td></tr>
              )}
              {orders !== null && orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id.slice(0, 8)}</strong>
                    <small>{formatDateTime(order.createdAt)}</small>
                  </td>
                  <td>
                    <strong>{order.name}</strong>
                    <small>{order.phone}</small>
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <Fragment key={index}>
                        {index > 0 && <br />}
                        {item.name} × {item.quantity}
                      </Fragment>
                    ))}
                  </td>
                  <td><strong>{money(order.total)}</strong></td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(event) => onStatusChange(order.id, event.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
