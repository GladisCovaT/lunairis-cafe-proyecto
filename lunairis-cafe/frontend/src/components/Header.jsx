import { useState } from 'react';
import { navLinks } from '../data/navLinks';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <a href="#inicio" className="logo">LUNAIRIS<span> CAFÉ</span></a>

      <button
        className="menu-toggle"
        id="menuToggle"
        aria-label="Abrir menú"
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰
      </button>

      <nav id="navMenu" className={menuOpen ? 'open' : ''}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>

      <a href="#reservas" className="header-button">Reserva tu espacio</a>
    </header>
  );
}
