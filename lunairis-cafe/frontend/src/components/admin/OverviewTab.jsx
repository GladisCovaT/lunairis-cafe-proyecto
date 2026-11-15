import StatCard from './StatCard.jsx';
import WeeklyChart from './WeeklyChart.jsx';
import { money } from '../../utils/format';

export default function OverviewTab({ active, dashboard, seoScore, onGoto }) {
  const stats = dashboard?.stats;
  const dash = (value) => (stats ? value : '—');

  return (
    <section className={`admin-tab${active ? ' active' : ''}`} id="tab-overview">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">TU ESPACIO, EN UN VISTAZO</p>
          <h2>Hola, equipo Lunairis <span>✳</span></h2>
          <p>Esto es lo que está pasando hoy en tu universo.</p>
        </div>
        <a href="/" className="admin-button outline">Ver sitio público ↗</a>
      </div>

      <div className="stats-grid">
        <StatCard tone="green" icon="☕" label="Productos activos" value={dash(stats?.products)}>
          En tu carta actual
        </StatCard>
        <StatCard tone="lilac" icon="✉" label="Mensajes recibidos" value={dash(stats?.messages)}>
          <b>{stats?.newMessages ?? 0}</b> por revisar
        </StatCard>
        <StatCard tone="gold" icon="▤" label="Pedidos registrados" value={dash(stats?.orders)}>
          <b>{stats?.pendingOrders ?? 0}</b> pendientes
        </StatCard>
        <StatCard tone="brown" icon="$" label="Valor de pedidos" value={stats ? money(stats.revenue) : '—'}>
          Pedidos no cancelados
        </StatCard>
      </div>

      <div className="overview-grid">
        <article className="panel-card chart-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MOVIMIENTO RECIENTE</p>
              <h3>Pedidos de los últimos 7 días</h3>
            </div>
            <span className="panel-chip">Actividad</span>
          </div>
          <WeeklyChart days={dashboard?.weeklyOrders || []} />
          <div className="chart-legend">
            <span><i></i> Pedidos recibidos</span>
            <small>Se actualiza con los pedidos registrados</small>
          </div>
        </article>

        <article className="panel-card quick-card">
          <p className="eyebrow">ACCESOS RÁPIDOS</p>
          <h3>¿Qué vamos a cuidar hoy?</h3>
          <button onClick={() => onGoto('products')}>＋ Actualizar la carta <span>↗</span></button>
          <button onClick={() => onGoto('orders')}>▤ Revisar pedidos <span>↗</span></button>
          <button onClick={() => onGoto('messages')}>✉ Leer mensajes <span>↗</span></button>
          <div className="quick-note">“Cada detalle puede hacer que alguien se sienta en casa.”</div>
        </article>
      </div>

      <div className="panel-card seo-mini">
        <div>
          <p className="eyebrow">VISIBILIDAD DIGITAL</p>
          <h3>La experiencia también empieza en Google.</h3>
          <p>Revisa los elementos técnicos que ayudan a los buscadores a entender tu sitio.</p>
        </div>
        <div className="seo-mini-score">
          <strong id="miniSeoScore">{seoScore === null ? '—' : `${seoScore}/100`}</strong>
          <span>SEO</span>
          <button onClick={() => onGoto('seo')}>Ver auditoría ↗</button>
        </div>
      </div>
    </section>
  );
}
