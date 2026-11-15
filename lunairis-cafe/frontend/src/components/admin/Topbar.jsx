export default function Topbar({ title, email, onToggleSidebar }) {
  return (
    <header className="admin-topbar">
      <button className="mobile-side-toggle" id="mobileSideToggle" aria-label="Abrir menú" onClick={onToggleSidebar}>☰</button>
      <div>
        <p className="eyebrow">LUNAIRIS / ADMINISTRACIÓN</p>
        <h1 id="pageTitle">{title}</h1>
      </div>
      <div className="admin-user">
        <span className="user-avatar">L</span>
        <div>
          <strong>Administración</strong>
          <small id="adminEmail">{email || 'Equipo Lunairis'}</small>
        </div>
      </div>
    </header>
  );
}
