import { money } from '../../utils/format';

export default function ProductTable({ products, onEdit, onDelete }) {
  const count = products ? products.length : 0;

  return (
    <div className="panel-card table-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">PRODUCTOS REGISTRADOS</p>
          <h3>Tu catálogo</h3>
        </div>
        <span id="productCountLabel" className="panel-chip">{count} productos</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="adminProductRows">
            {products === null && (
              <tr><td colSpan="5">Cargando catálogo…</td></tr>
            )}
            {products !== null && products.length === 0 && (
              <tr><td colSpan="5" className="table-empty">Todavía no hay productos.</td></tr>
            )}
            {products !== null && products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.tagline || ''}</small>
                </td>
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
                <td>
                  <span className={`status-pill ${product.active ? '' : 'off'}`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => onEdit(product)}>Editar</button>
                    <button className="delete" onClick={() => onDelete(product.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
