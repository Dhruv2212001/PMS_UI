import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { HeaderComponent } from './header/header.component';
import { roleGuard } from '../../auth/role.guard';


const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        // pathMatch: 'full',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'productdemand',
        loadComponent: () => import('./product-demand/product-demand.component').then(m => m.ProductDemandComponent)
      },
      {
        path: 'adduser',
        // canActivate: [roleGuard],
        loadComponent: () => import('./add-user/add-user.component').then(m => m.AddUserComponent)
      },
      {
        path: 'systemrole',
        // canActivate: [roleGuard],
        loadComponent: () => import('./system-role/system-role.component').then(m => m.SystemRoleComponent)
      },
      {
        path: 'dashboard/:id',
        loadComponent: () => import('./dashboard/productview/productview.component').then(m => m.ProductviewComponent)
      },
      {
        path: 'userprofile',
        loadComponent: () => import('./userprofile/userprofile.component').then(m => m.UserprofileComponent)
      },
      {
        path: 'changepassword',
        loadComponent: () => import('./changepassword/changepassword.component').then(m => m.ChangepasswordComponent)
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
