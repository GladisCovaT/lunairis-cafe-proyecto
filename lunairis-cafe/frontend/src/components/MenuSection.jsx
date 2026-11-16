import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import FilterButtons from './FilterButtons.jsx';
import ProductCard from './ProductCard.jsx';
import CartPanel from './CartPanel.jsx';
import { useCart } from '../hooks/useCart';
import { menuFilters, products } from '../data/products';

export default function MenuSection({ onOpenCart }) {
  const [activeFilter, setActiveFilter] = useState('todos');
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
        {visibleProducts.map((product) => {
          const itemInCart = cart.items.find((item) => item.id === product.id);
          const currentQty = itemInCart ? itemInCart.qty || itemInCart.quantity || 1 : 0;

          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={currentQty}
              onAdd={cart.addItem}
              onRemove={cart.removeOne}
            />
          );
        })}
      </div>

      {/* CartPanel ahora le avisa al padre (App.jsx) que debe abrir el carrito global */}
      <CartPanel
        count={cart.count}
        total={cart.total}
        onToggleDetails={onOpenCart}
      />
    </section>
  );
}