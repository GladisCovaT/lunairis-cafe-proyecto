import { productCategories } from '../../data/adminTabs';

export default function ProductForm({
  formRef, values, onChange, onSubmit, onReset, isEditing, saving, feedback
}) {
  return (
    <form className="panel-card product-form" id="productForm" ref={formRef} onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">EDITOR DE CARTA</p>
          <h3 id="productFormTitle">{isEditing ? 'Editar producto' : 'Crear producto'}</h3>
        </div>
        <span className="form-dot">✳</span>
      </div>

      <label>Nombre
        <input name="name" required maxLength="70" placeholder="Ej. Latte Luna"
          value={values.name} onChange={onChange} />
      </label>

      <div className="form-two">
        <label>Categoría
          <select name="category" value={values.category} onChange={onChange}>
            {productCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>Precio (COP)
          <input name="price" type="number" min="1000" max="1000000" step="500" required
            placeholder="12500" value={values.price} onChange={onChange} />
        </label>
      </div>

      <label>Frase corta
        <input name="tagline" maxLength="90" placeholder="Una pausa para ti"
          value={values.tagline} onChange={onChange} />
      </label>

      <label>Descripción
        <textarea name="description" required maxLength="240" rows="3"
          placeholder="Describe este producto..." value={values.description} onChange={onChange}></textarea>
      </label>

      <div className="form-two">
        <label>Símbolo
          <input name="icon" maxLength="4" placeholder="☾" value={values.icon} onChange={onChange} />
        </label>
        <label className="check-label">
          <input type="checkbox" name="featured" checked={values.featured} onChange={onChange} /> Marcar como favorito
        </label>
      </div>

      <div className="form-actions">
        <button className="admin-button primary" type="submit" id="saveProductButton" disabled={saving}>
          {isEditing ? 'Guardar cambios' : 'Guardar producto'}
        </button>
        <button className="admin-button outline" type="button" id="cancelEditButton" onClick={onReset}>
          Limpiar
        </button>
      </div>

      <p className="inline-feedback" id="productFeedback" role="status">{feedback}</p>
    </form>
  );
}
