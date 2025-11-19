import { Routes } from '@angular/router';
import { TestPage } from './test-page/test-page';
import { authGuard } from '../../core/guards/auth.guard';

export const testRoutes: Routes = [
  {
    path: 'test',
    component: TestPage,
    canActivate: [authGuard]
  }
];
