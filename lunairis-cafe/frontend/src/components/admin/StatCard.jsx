// Tarjeta de cifra del resumen. "tone" puede ser green, lilac, gold o brown
export default function StatCard({ tone, icon, label, value, children }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{children}</small>
      <div className={`stat-line ${tone}-line`}></div>
    </article>
  );
}
