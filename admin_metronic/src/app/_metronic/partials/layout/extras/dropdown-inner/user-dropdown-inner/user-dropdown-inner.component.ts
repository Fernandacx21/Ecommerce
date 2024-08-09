import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: any = null; // Observable<any> = null;

  users_actives:any = [];
  constructor(private layout: LayoutService, private auth: AuthService) {}

  isHability:Boolean = false;
  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    // this.user$ = this.auth.isLoadingSubject.next(true);
    this.user$ = this.auth.user;
    // if(this.user$.role.name == "ADMINISTRADOR"){
    //   this.isHability = true;
    // }
    // this.usersActives()
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  } 
}
