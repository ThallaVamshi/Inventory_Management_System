export const environment = {
  production: true,
  apiUrl: typeof window !== 'undefined'
    ? (window.location.hostname.includes('vercel.app')
        ? 'https://inventory-management-system-b9tb.onrender.com/api'
        : (window.location.port === '4200' ? 'http://localhost:5000/api' : '/api'))
    : '/api'
};