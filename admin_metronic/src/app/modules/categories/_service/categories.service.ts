import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  allCategories(search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders ({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/categories/list?search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createCategorie(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders ({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/categories/register";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateCategorie(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/categories/update";
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteCategorie(categorie_id){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS+"/categories/delete?_id="+categorie_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
