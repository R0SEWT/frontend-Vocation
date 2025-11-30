import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

const checkAuth = (): boolean => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (!session.hasAccessToken()) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

export const authGuard: CanActivateFn & CanMatchFn = (route, state) => checkAuth();
