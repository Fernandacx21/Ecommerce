import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

declare function alertDanger([]):any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

email: string = "";
password: string = "";

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

    ngOnInit(): void {
      //console.log(this.authService.user);
      if (this.authService.user) {
        this.router.navigate(["/"]);
      }
    }
    
    login(){
      if(!this.email){
        alertDanger("ES NECESARIO INGRESAR EL EMAIL");
      }

      if(!this.password){
        alertDanger("ES NECESARIO INGRESAR UNA CONTRASEÑA");
      }

      this.authService.login(this.email,this.password).subscribe((resp:any) => {
        console.log(resp);
      if(!resp.error && resp){
        //SE INGRESO CON EXITO
        //this.router.navigate(["/"]);
        location.reload();
      }else{
        alert(resp.error.message);
      }
      })
    }
}
