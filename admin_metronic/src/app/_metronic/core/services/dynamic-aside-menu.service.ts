import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { AsideMenuAdminGeneral } from '../../configs/nav/aside-menu-admin-general.config';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(private authservice: AuthService,) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  private loadMenu() {
    // this.setMenu(DynamicAsideMenuConfig);
    if(this.authservice.user.rol == 'admin'){
      this.setMenu(AsideMenuAdminGeneral);
    } 
    // else if(this.authservice.user.role.name == 'ASESOR'){
    //   this.setMenu(AsideMenuAsesor);
    // } 
    // else if(this.authservice.user.role.name == 'COMERCIAL'){
    //   this.setMenu(AsideMenuComercial);
    // } else if(this.authservice.user.role.name == 'MARKETING'){
    //   this.setMenu(AsideMenuMarketing);
    // } else if(this.authservice.user.role.name == 'CONSULTORIA'){
    //   this.setMenu(AsideMenuConsultoria);
    // } else if(this.authservice.user.role.name == 'GENERAL'){
    //   this.setMenu(AsideMenuGeneral);
    else {
      this.setMenu([]);
    }
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
