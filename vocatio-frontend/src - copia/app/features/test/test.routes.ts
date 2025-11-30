import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const testRoutes: Routes = [
  {
    path: 'test',
    canActivate: [authGuard],
    loadComponent: () => import('./test-page.component').then((m) => m.TestPageComponent)
  }
];
