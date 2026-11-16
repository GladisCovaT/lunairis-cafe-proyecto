import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ExperiencesSection from './components/ExperiencesSection.jsx';
import MenuSection from './components/MenuSection.jsx';
import RoutineSection from './components/RoutineSection.jsx';
import BookingSection from './components/BookingSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import CartDetails from './components/CartDetails.jsx';

export default function App() {
  // IMPORTANTE: Empieza en false para que la página cargue libre y limpia por defecto
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Chocolate caliente', price: 7000, quantity: 1 }
  ]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <>
      <Header />
      
      <main>
        <Hero />
        <ExperiencesSection />
        <MenuSection />
        <RoutineSection />
        <BookingSection />
        <ContactSection />
      </main>
      
      <Footer />

      {/* El carrito solo aparece en pantalla cuando realmente haces clic en ver pedido */}
      {isCartOpen && (
        <CartDetails 
          items={cartItems}
          total={total}
          onRemove={handleRemoveItem}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
}