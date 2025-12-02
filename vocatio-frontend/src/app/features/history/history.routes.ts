import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const historyRoutes: Routes = [
  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () => import('./history-page.component').then(m => m.HistoryPageComponent)
  }
];
