import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { testRoutes } from './features/test/test.routes';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  ...authRoutes,
  ...testRoutes,
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent)
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
