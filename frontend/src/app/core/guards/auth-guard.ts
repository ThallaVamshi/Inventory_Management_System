import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Check if route requires specific roles
  const requiredRoles = route.data?.['roles'] as Array<string>;
  if (requiredRoles && requiredRoles.length > 0) {
    if (!userJson) {
      router.navigate(['/login']);
      return false;
    }
    const user = JSON.parse(userJson);
    if (!requiredRoles.includes(user.role)) {
      // Access Denied: Redirect to dashboard
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};