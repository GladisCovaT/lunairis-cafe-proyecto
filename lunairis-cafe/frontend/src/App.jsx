import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ExperiencesSection from './components/ExperiencesSection.jsx';
import MenuSection from './components/MenuSection.jsx';
import RoutineSection from './components/RoutineSection.jsx';
import BookingSection from './components/BookingSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
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
    </>
  );
}
