import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth-profile/_services/auth.guard';

export const routes: Routes = [
  {
  path: '',
  loadChildren: () => import("./modules/home/home.module").then(m => m.HomeModule),
  },
  {
    path: '',
    loadChildren: () => import("./modules/ecommerce-guest/ecommerce-guest.module").then(m => m.EcommerceGuestModule),
  },
  {
    path: '',
    //canActivate: [AuthGuard],
    loadChildren: () => import("./modules/ecommerce-auth/ecommerce-auth.module").then(m => m.EcommerceAuthModule),
  },
  {
    path: 'auth',
    loadChildren: () => import("./modules/auth-profile/auth-profile.module").then(m => m.AuthProfileModule),
    },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
{
  path: '**',
  redirectTo: 'error/404',
}
]

@NgModule({
  //declarations: [],
  imports: [
    //CommonModule
    RouterModule.forRoot(routes)
  ],
  exports: [
  RouterModule,
  ]
})
export class AppRoutingModule { }
