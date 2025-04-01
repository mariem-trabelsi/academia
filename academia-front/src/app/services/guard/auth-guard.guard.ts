import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = () => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);

  if (tokenService.keycloak.isTokenExpired()) {
    router.navigate(['login']);
    return false;
  }

  const isAdmin = tokenService.hasRole('ADMIN');
  if (!isAdmin) {
    router.navigate(['discover']); 
    return false;
  }

  return true;
};