// Fecha de hoy en formato AAAA-MM-DD según la zona horaria del usuario (para el atributo min del input date)
export function getLocalToday() {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}
