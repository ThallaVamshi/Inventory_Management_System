export const environment = {
  production: false,
  apiUrl: typeof window !== 'undefined' && window.location.port === '4200'
    ? 'http://127.0.0.1:5000/api'
    : '/api'
};