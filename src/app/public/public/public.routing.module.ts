import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicModule } from './public.module';

const routes: Routes = [

      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('../login/login.component').then(m => m.LoginComponent)
      },
      {
        path: '**',
        loadComponent: () => import('../not-found/not-found.component').then(m => m.NotFoundComponent)
      },

];

export const PublicRouting: ModuleWithProviders<PublicModule> = RouterModule.forChild(
  routes
);
