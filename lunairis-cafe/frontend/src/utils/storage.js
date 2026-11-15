export const STORAGE_KEYS = {
  reservations: 'lunairisReservations',
  messages: 'lunairisMessages'
};

// Agrega un elemento a una lista guardada en localStorage
export function appendToStorageList(key, item) {
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
}
