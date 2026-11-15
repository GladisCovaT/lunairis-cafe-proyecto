import { useRef, useState } from 'react';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';
import { useForm } from '../../hooks/useForm';

const emptyProduct = {
  id: '',
  name: '',
  category: 'Cafés',
  price: '',
  tagline: '',
  description: '',
  icon: '',
  featured: false
};

export default function ProductsTab({ active, products, onSave, onDelete }) {
  const { values, setValues, handleChange, reset } = useForm(emptyProduct);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const resetForm = () => {
    reset();
    setFeedback('');
  };

  const handleNew = () => {
    resetForm();
    scrollToForm();
  };

  const handleEdit = (product) => {
    setValues({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      tagline: product.tagline ?? '',
      description: product.description,
      icon: product.icon ?? '',
      featured: Boolean(product.featured)
    });
    scrollToForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
    onDelete(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { id, price, ...rest } = values;
    const data = { ...rest, price: Number(price), active: true };

    setSaving(true);
    try {
      await onSave(id, data);
      resetForm();
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`admin-tab${active ? ' active' : ''}`} id="tab-products">
      <div className="tab-intro">
        <div>
          <p className="eyebrow">CARTA LUNARIS</p>
          <h2>Gestiona tus productos.</h2>
          <p>Añade nuevas bebidas, actualiza precios o retira productos del catálogo público.</p>
        </div>
        <button className="admin-button primary" id="newProductButton" onClick={handleNew}>＋ Nuevo producto</button>
      </div>

      <div className="products-layout">
        <ProductForm
          formRef={formRef}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
          isEditing={Boolean(values.id)}
          saving={saving}
          feedback={feedback}
        />
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </section>
  );
}
