import { CanActivateFn } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);  // Injecting the AuthService
  // Check if the user has the "admin" role
  const userRole = authService.getUserInfo()  // Assuming getUserRole() returns the user's role

  if (userRole.role === 'Admin') {
    return true;  // Allow access if the role is 'admin'
  } else {
    return false;  // Deny access if the user is not 'admin'
  }
};
