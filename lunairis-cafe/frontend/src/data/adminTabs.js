// Pestañas del panel: "title" es el título de la barra superior; "badge" indica qué contador mostrar
export const adminTabs = [
  { id: 'overview', icon: '◫', label: 'Resumen', title: 'Resumen general' },
  { id: 'products', icon: '☕', label: 'Catálogo', title: 'Gestión del catálogo' },
  { id: 'orders', icon: '▤', label: 'Pedidos', title: 'Pedidos recibidos', badge: 'pendingOrders' },
  { id: 'messages', icon: '✉', label: 'Mensajes', title: 'Mensajes de la comunidad', badge: 'newMessages' },
  { id: 'seo', icon: '✳', label: 'Salud SEO', title: 'Salud SEO del sitio' }
];

export const orderStatuses = ['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado'];
export const messageStatuses = ['Nuevo', 'En seguimiento', 'Respondido'];
export const productCategories = ['Cafés', 'Especiales', 'Tés e infusiones', 'Fríos', 'Repostería'];
