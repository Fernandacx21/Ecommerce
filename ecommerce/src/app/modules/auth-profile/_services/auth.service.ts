import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { URL_SERVICIOS } from 'src/app/config/config';
import { catchError, map } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any = null;
  token:any = null;

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { 
    this.getLocalStorage();
  } 

  getLocalStorage(){
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user") ?? '');
    }else{
      this.token = null;
      this.user = null;
    }
  }

  login(email:string, password: string){
      let URL = URL_SERVICIOS + "users/login"
      return this.http.post(URL,{email,password}).pipe(
        map((resp:any) => {
          if(resp.USER_FRONTED && resp.USER_FRONTED.token){
            //ALMACENAR EL TOKEN EN EL LOCALSTORAGE
            return this.localStorageSave(resp.USER_FRONTED)
          }else{
            //DEVUELVE EL STATUS
            return resp;
          }
        }),
        catchError((erro:any) => {
          console.log(erro);
          return of (erro);
        })
      )
    }
      localStorageSave(USER_FRONTED: any){
        localStorage.setItem("token",USER_FRONTED.token);
        localStorage.setItem("user",JSON.stringify(USER_FRONTED.user));
        return true;
  }

  registro(data:any){
    let URL = URL_SERVICIOS + "users/register";
    return this.http.post(URL,data);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //this.router.navigate(["auth/login"]);
    location.reload();
  }
}