import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const achievementsRoutes: Routes = [
  {
    path: 'achievements',
    canActivate: [authGuard],
    loadComponent: () => import('./achievements-page.component').then(m => m.AchievementsPageComponent)
  }
];
