import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { testRoutes } from './features/test/test.routes';
import { authGuard } from './core/guards/auth.guard';
import { profileRoutes } from './features/profile/profile.routes';
import { achievementsRoutes } from './features/achievements/achievements.routes';
import { materialsRoutes } from './features/materials/materials.routes';
import { historyRoutes } from './features/history/history.routes';

export const routes: Routes = [
  ...authRoutes,
  ...testRoutes,
  ...profileRoutes,
  ...achievementsRoutes,
  ...materialsRoutes,
  ...historyRoutes,
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent)
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
