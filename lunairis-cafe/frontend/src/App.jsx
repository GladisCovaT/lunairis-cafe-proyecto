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
import { useCart } from './hooks/useCart';

// 1. Importa el componente del asistente de IA que creamos
import AdminAIAssistant from './components/AdminAIAssistant.jsx';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // El carrito vive aquí arriba, siendo la única fuente de verdad
  const cart = useCart();

  return (
    <>
      {/* Pasamos los datos del carrito o la función para abrirlo al Header si lo necesita */}
      <Header onOpenCart={() => setIsCartOpen(true)} count={cart.count} />
      
      <main>
        <Hero />
        <ExperiencesSection />
        {/* Le pasamos el objeto 'cart' completo a MenuSection para que use los mismos datos */}
        <MenuSection cart={cart} onOpenCart={() => setIsCartOpen(true)} />
        <RoutineSection />
        <BookingSection />
        <ContactSection />
      </main>
      
      <Footer />

      {isCartOpen && (
        <CartDetails 
          items={cart.items}
          total={cart.total}
          hidden={false}
          onRemove={cart.removeOne}
          onClearCart={cart.clearCart}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* 2. Coloca el botón flotante de IA aquí para que aparezca abajo a la derecha */}
      <AdminAIAssistant />
    </>
  );
}