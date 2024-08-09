import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  
  allDiscounts(search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/list?search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showDiscount(discount_id=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/show?discount_id="+discount_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  discountConfig(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createDiscount(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/register";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateDiscount(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/update";
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteDiscount(cupone_id){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/discount/delete?_id="+cupone_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
}
