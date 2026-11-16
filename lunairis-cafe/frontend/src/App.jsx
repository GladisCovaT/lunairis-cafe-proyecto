import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ExperiencesSection from './components/ExperiencesSection.jsx';
import MenuSection from './components/MenuSection.jsx';
import RoutineSection from './components/RoutineSection.jsx';
import BookingSection from './components/BookingSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import CartDetails from './components/CartDetails.jsx'; // <--- Importamos tu componente del carrito

export default function App() {
  // Estado para controlar si el carrito está abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estado de los productos del carrito (ejemplo o conectado con tu menú)
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Chocolate caliente', price: 7000, quantity: 1 }
  ]);

  // Calcular total automáticamente
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Función para quitar productos
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <>
      {/* Puedes pasarle una función al Header o Navbar para que abra el carrito cuando hagan clic */}
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main>
        <Hero />
        <ExperiencesSection />
        <MenuSection />
        <RoutineSection />
        <BookingSection />
        <ContactSection />
      </main>
      
      <Footer />

      {/* Panel lateral del carrito / pagos con el fondo desvanecido (Backdrop) */}
      <CartDetails 
        items={cartItems}
        total={total}
        hidden={!isCartOpen}
        onRemove={handleRemoveItem}
        onClose={() => setIsCartOpen(false)} // <--- ¡Esto es lo que hace que la "✕" y el fondo oscuro cierren el panel!
      />
    </>
  );
}