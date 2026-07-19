const { match } = require('path-to-regexp');

const fn = match('/{*any}');
const testRoutes = ['/', '/dashboard', '/products/add', '/api/users'];

testRoutes.forEach(r => {
  const result = fn(r);
  console.log(`Route: "${r}" -> Match: ${!!result}`, result ? JSON.stringify(result.params) : '');
});
