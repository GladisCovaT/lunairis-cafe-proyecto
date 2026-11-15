import { adminTabs } from '../../data/adminTabs';

export default function Sidebar({ open, activeTab, badges, onSelectTab, onLogout }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`} id="sidebar">
      <a className="admin-brand" href="/">
        <img src="/assets/logo.svg" alt="" width="42" height="42" />
        <span>Lunairis <em>Café</em></span>
      </a>

      <div className="sidebar-label">ESPACIO DE TRABAJO</div>

      <nav className="side-nav" aria-label="Secciones administrativas">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            className={`side-link${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
            {tab.badge && <b>{badges[tab.badge]}</b>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span>✿</span>
          <p>Un buen espacio<br />se construye en comunidad.</p>
        </div>
        <button className="logout-button" id="logoutButton" onClick={onLogout}>↪ Cerrar sesión</button>
        <a className="back-link" href="/">← Ver sitio público</a>
      </div>
    </aside>
  );
}
