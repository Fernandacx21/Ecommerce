import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  user: any;
  token: string;
  constructor(
    // private authHttpService: AuthHTTPService,
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
    this.loadstorage();
  }

  loadstorage(){
    if(localStorage.getItem("token")){
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user"));
    }else{
      this.user=null;
      this.token = '';
    }
  }
  // public methods
  isLogued() {
    return ( this.token.length > 5 ) ? true : false;
  }
login(email: string, password: string) {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + "/users/login_admin";
    console.log({email, password})
    return this.http.post(url,{email, password}).pipe(
      map((auth: any) => {
        console.log(auth)
        if(auth.USER_FRONTED && auth.USER_FRONTED.token){
            return this.setAuthFromLocalStorage(auth);
          }else{
            return auth;
          }
      }),
      // switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
logout() {
    // localStorage.removeItem(this.authLocalStorageToken);
    this.user = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  // getUserByToken(): Observable<UserModel> {
  //   const auth = this.getAuthFromLocalStorage();
  //   if (!auth || !auth.accessToken) {
  //     return of(undefined);
  //   }

  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.getUserByToken(auth.accessToken).pipe(
  //     map((user: UserModel) => {
  //       if (user) {
  //         this.currentUserSubject = new BehaviorSubject<UserModel>(user);
  //       } else {
  //         this.logout();
  //       }
  //       return user;
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // // need create new user then login
  // registration(user: UserModel): Observable<any> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.createUser(user).pipe(
  //     map(() => {
  //       this.isLoadingSubject.next(false);
  //     }),
  //     switchMap(() => this.login(user.email, user.password)),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // forgotPassword(email: string): Observable<boolean> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService
  //     .forgotPassword(email)
  //     .pipe(finalize(() => this.isLoadingSubject.next(false)));
  // }

  // private methods
  private setAuthFromLocalStorage(auth: any): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    //if (auth.access_token && auth.user) {
      localStorage.setItem('token', auth.USER_FRONTED.token);
      localStorage.setItem('user', JSON.stringify(auth.USER_FRONTED.user));
      this.user = auth.USER_FRONTED.access_token;
      this.token = auth.USER_FRONTED.user;
      return true;
    //}
    //return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
