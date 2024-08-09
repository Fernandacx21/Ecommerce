import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authService.isLogued()){
      this.router.navigate(["/auth/login"]);
      return false;
    }
    let token = this.authService.token;
    let expirado = (JSON.parse(atob(token!.split('.')[1]))).exp;
    if((Math.floor((new Date).getTime() / 1000)) >= expirado){
      this.authService.logout();
      return false;
    }else{
      return true;
    }
  }
}
