import { getSeoGrade } from '../../hooks/useSeoAudit';

export default function SeoTab({ active, audit, onRefresh }) {
  return (
    <section className={`admin-tab${active ? ' active' : ''}`} id="tab-seo">
      <div className="tab-intro">
        <div>
          <p className="eyebrow">VISIBILIDAD Y CALIDAD TÉCNICA</p>
          <h2>Salud SEO del sitio.</h2>
          <p>Auditoría básica automática de elementos que ayudan a los buscadores a comprender Lunairis.</p>
        </div>
        <button className="admin-button outline" id="refreshSeoButton" onClick={onRefresh}>↻ Volver a revisar</button>
      </div>

      <div className="seo-layout">
        <article className="panel-card seo-score-card">
          <p className="eyebrow">PUNTUACIÓN DE LA AUDITORÍA</p>
          <div className={`seo-gauge${audit ? ` score-${audit.score}` : ''}`} id="seoGauge">
            <div>
              <strong id="seoScore">{audit ? audit.score : '—'}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <h3 id="seoGrade">{audit ? getSeoGrade(audit.score) : 'Calculando revisión…'}</h3>
          <p>La puntuación representa la presencia de buenas prácticas técnicas básicas; no garantiza una posición específica en Google.</p>
          <small id="seoAuditDate">{audit ? `Última revisión: ${audit.date}` : ''}</small>
        </article>

        <article className="panel-card seo-checks-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">LISTA DE COMPROBACIÓN</p>
              <h3>Elementos detectados</h3>
            </div>
            <span className="panel-chip" id="seoPassed">
              {audit ? `${audit.passed} / ${audit.total}` : '0 / 10'}
            </span>
          </div>

          <div id="seoChecks" className="seo-check-list">
            {!audit && <p>Preparando auditoría…</p>}
            {audit && audit.checks.map((check) => (
              <div className="seo-check" key={check.label}>
                <div>
                  <strong>{check.label}</strong>
                  <small>{check.detail}</small>
                </div>
                <span className={`check-result ${check.ok ? '' : 'pending'}`}>
                  {check.ok ? '✓ Correcto' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="seo-tip">
        <span>✦</span>
        <p>
          <strong>Importante:</strong> antes de publicar, cambia el dominio de ejemplo en{' '}
          <code>index.html</code>, <code>robots.txt</code> y <code>sitemap.xml</code> por el dominio real de Lunairis Café.
        </p>
      </div>
    </section>
  );
}
