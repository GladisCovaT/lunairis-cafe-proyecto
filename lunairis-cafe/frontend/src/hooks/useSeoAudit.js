import { useCallback, useState } from 'react';

// Revisa la página pública ("/") y evalúa 10 comprobaciones técnicas de SEO
export function useSeoAudit() {
  const [audit, setAudit] = useState(null);

  const runSeoAudit = useCallback(async () => {
    const checks = [];
    const addCheck = (label, ok, detail) => checks.push({ label, ok, detail });

    try {
      const response = await fetch('/', { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo leer la página pública.');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const meta = (name) => doc.querySelector(`meta[name="${name}"]`)?.content?.trim() || '';
      const property = (name) => doc.querySelector(`meta[property="${name}"]`)?.content?.trim() || '';
      const canonical = doc.querySelector('link[rel="canonical"]')?.href || '';
      const images = [...doc.querySelectorAll('img')];
      const imageAlts = images.length > 0 && images.every((image) => image.hasAttribute('alt'));
      const robotsAndMap = Boolean(meta('robots'));

      addCheck('Título descriptivo', doc.title.trim().length >= 20 && doc.title.trim().length <= 65, 'El título identifica la marca y la propuesta.');
      addCheck('Meta descripción', meta('description').length >= 70 && meta('description').length <= 170, 'Resumen para los resultados de búsqueda.');
      addCheck('Un encabezado H1', doc.querySelectorAll('h1').length === 1, 'Una jerarquía principal clara por página.');
      addCheck('Idioma declarado', doc.documentElement.lang === 'es', 'El documento declara español como idioma.');
      addCheck('Diseño adaptable', Boolean(doc.querySelector('meta[name="viewport"]')), 'Configuración para móviles y pantallas pequeñas.');
      addCheck('Datos para compartir', Boolean(property('og:title') && property('og:description') && property('og:image')), 'Metadatos Open Graph para compartir el sitio.');
      addCheck('Dominio canónico real', Boolean(canonical && !canonical.includes('.example') && !canonical.includes('tudominio')), 'Reemplaza el dominio de ejemplo por el dominio público real.');
      addCheck('Estructura semántica', Boolean(doc.querySelector('main') && doc.querySelector('nav') && doc.querySelector('footer')), 'Uso de regiones semánticas para organizar el contenido.');
      addCheck('Texto alternativo en imágenes', imageAlts, `${images.length} imagen(es) encontradas; todas deben tener atributo alt.`);
      addCheck('Directivas para buscadores', robotsAndMap, 'Meta robots presente; publica también sitemap.xml.');
    } catch (error) {
      addCheck('Página pública disponible', false, error.message);
    }

    const passed = checks.filter((check) => check.ok).length;
    const score = Math.round((passed / checks.length) * 100);

    setAudit({
      checks,
      passed,
      total: checks.length,
      score,
      date: new Date().toLocaleString('es-CO')
    });
  }, []);

  return { audit, runSeoAudit };
}

export function getSeoGrade(score) {
  if (score >= 90) return 'Una base digital sólida';
  if (score >= 70) return 'Buen inicio, hay detalles por pulir';
  return 'Necesita algunos ajustes';
}
