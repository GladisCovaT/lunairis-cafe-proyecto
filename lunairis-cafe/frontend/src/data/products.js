// Filtros del menú: "key" coincide con la "category" de cada producto
export const menuFilters = [
  { key: 'todos', label: 'Todo' },
  { key: 'cafe', label: 'Cafés' },
  { key: 'bebidas', label: 'Bebidas' },
  { key: 'panaderia', label: 'Panadería' },
  { key: 'infantil', label: 'Menú infantil' }
];

export const products = [
  { id: 'cappuccino', category: 'cafe', label: 'CAFETERÍA', name: 'Cappuccino Lunairis', description: 'Café espresso con leche cremosa.', price: 9000, image: '/assets/cappuccino.jpg', alt: 'Cappuccino' },
  { id: 'latte', category: 'cafe', label: 'CAFETERÍA', name: 'Vanilla Latte', description: 'Espresso, leche y un toque de vainilla.', price: 10000, image: '/assets/latte.jpg', alt: 'Latte' },
  { id: 'chocolate-frio', category: 'bebidas', label: 'BEBIDAS', name: 'Chocolate frío', description: 'Chocolate cremoso y refrescante.', price: 8000, image: '/assets/chocolate.jpg', alt: 'Chocolate frío' },
  { id: 'croissant', category: 'panaderia', label: 'PANADERÍA', name: 'Croissant artesanal', description: 'Hojaldre dorado y recién horneado.', price: 6000, image: '/assets/croissant.jpg', alt: 'Croissant' },
  { id: 'pan', category: 'panaderia', label: 'PANADERÍA', name: 'Pan artesanal', description: 'Una opción deliciosa para acompañar.', price: 5000, image: '/assets/bread.jpg', alt: 'Pan artesanal' },
  { id: 'mini-pizza', category: 'infantil', label: 'MENÚ INFANTIL', name: 'Mini pizza', description: 'Pizza individual con queso.', price: 15000, image: '/assets/pizza.jpg', alt: 'Pizza infantil' },
  { id: 'mini-hamburguesa', category: 'infantil', label: 'MENÚ INFANTIL', name: 'Mini hamburguesa', description: 'Hamburguesa especial para pequeños.', price: 15000, image: '/assets/burger.jpg', alt: 'Hamburguesa infantil' },
  { id: 'milo', category: 'infantil', label: 'MENÚ INFANTIL', name: 'Milo frío o caliente', description: 'Una bebida clásica para disfrutar.', price: 7000, image: '/assets/milo.jpg', alt: 'Milo frío' },
  { id: 'chocolate-caliente', category: 'infantil', label: 'MENÚ INFANTIL', name: 'Chocolate caliente', description: 'Chocolate suave y reconfortante.', price: 7000, image: '/assets/hot-chocolate.jpg', alt: 'Chocolate caliente' }
];
