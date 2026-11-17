export async function api(endpoint, options = {}) {
  // Obtenemos la URL base del entorno (en local será 'http://localhost:3000', en Vercel estará vacía)
  const baseURL = import.meta.env.VITE_API_URL || '';
  
  // Construimos la URL completa si el endpoint empieza con '/' y hay una base URL configurada
  const url = endpoint.startsWith('/') && baseURL ? `${baseURL}${endpoint}` : endpoint;

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Útil si manejas cookies o sesiones (como express-session / connect-mongo)
    headers: { 
      'Content-Type': 'application/json', 
      ...(options.headers || {}) 
    }
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'No se pudo completar la acción.');
  }
  
  return data;
}