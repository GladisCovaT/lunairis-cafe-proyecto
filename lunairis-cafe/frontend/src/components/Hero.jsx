export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <img className="hero-background" src="/assets/cafe.jpg" alt="Interior de Lunairis Café" />
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-tag">☾ UN ESPACIO PARA CONECTAR CONTIGO</span>

        <h1>
          Lunaris Café
          <span>Un lugar para sentir, crear y volver a ti.</span>
        </h1>

        <p>
          Mucho más que una cafetería. Un espacio donde el café,
          el arte, la tecnología y las experiencias se unen
          para crear momentos inolvidables.
        </p>

        <div className="hero-buttons">
          <a href="#experiencias" className="btn-primary">Descubre nuestra experiencia</a>
          <a href="#nosotros" className="btn-secondary">Conócenos</a>
        </div>
      </div>

      <div className="hero-scroll">
        <span>DESCUBRE LUNARIS</span>
        <span>↓</span>
      </div>
    </section>
  );
}
