
export default function Footer() {
  return (
    <footer className="footer" style={{
      background: '#1b3b2b', // Tu verde esmeralda institucional
      color: '#ffffff',
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="footer-content" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        
        {/* Nombre de la marca */}
        <h3 style={{ fontSize: '20px', letterSpacing: '2px', fontWeight: '600', margin: 0, color: '#f4eedc' }}>
          LUNAIRIS CAFÉ
        </h3>

        {/* Eslogan */}
        <p style={{ fontSize: '14px', opacity: 0.85, margin: 0, fontStyle: 'italic' }}>
          Un espacio donde cada generación tiene algo que descubrir.
        </p>

        {/* Línea divisora fina */}
        <div style={{ width: '50px', height: '1px', background: '#c49a70', margin: '10px 0' }}></div>

        {/* Copyright */}
        <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>
          &copy; {new Date().getFullYear()} Lunairis Café. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
}