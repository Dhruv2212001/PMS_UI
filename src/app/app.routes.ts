import { Routes } from '@angular/router';
import { NotFoundComponent } from './public/not-found/not-found.component';

export const routes: Routes = [
      {
        path: '',loadChildren: () => import('./secure/pages/pages.module').then(m => m.PagesModule)
      },
      {
        path: '',
        loadChildren: () => import('./public/public/public.module').then(m => m.PublicModule )
      },

];
