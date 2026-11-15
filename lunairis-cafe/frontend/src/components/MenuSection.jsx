import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import FilterButtons from './FilterButtons.jsx';
import ProductCard from './ProductCard.jsx';
import CartPanel from './CartPanel.jsx';
import CartDetails from './CartDetails.jsx';
import { useCart } from '../hooks/useCart';
import { menuFilters, products } from '../data/products';

export default function MenuSection() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [detailsHidden, setDetailsHidden] = useState(true);
  const cart = useCart();

  const visibleProducts = products.filter(
    (product) => activeFilter === 'todos' || product.category === activeFilter
  );

  return (
    <section className="section menu-section" id="menu">
      <SectionHeading
        eyebrow="SABORES QUE ACOMPAÑAN MOMENTOS"
        title="Nuestro pequeño universo de sabores"
        text="Desde un buen café hasta algo delicioso para compartir."
      />

      <FilterButtons filters={menuFilters} active={activeFilter} onChange={setActiveFilter} />

      <div className="product-grid" id="productGrid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={cart.addItem} />
        ))}
      </div>

      <CartPanel
        count={cart.count}
        total={cart.total}
        onToggleDetails={() => setDetailsHidden((hidden) => !hidden)}
      />

      <CartDetails
        items={cart.items}
        total={cart.total}
        hidden={detailsHidden}
        onRemove={cart.removeOne}
      />
    </section>
  );
}
