// Precio del sitio público: $9.000
export const formatPrice = (value) => '$' + value.toLocaleString('es-CO');

// Dinero del panel admin: $ 12.500 (pesos colombianos)
export const money = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatDateTime = (isoString) => new Date(isoString).toLocaleString('es-CO');
