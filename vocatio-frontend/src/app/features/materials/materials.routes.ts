import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const materialsRoutes: Routes = [
  {
    path: 'materials',
    canActivate: [authGuard],
    loadComponent: () => import('./materials-page.component').then(m => m.MaterialsPageComponent)
  }
];
