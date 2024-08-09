import { Component, OnInit } from '@angular/core';
import { productService } from '../_services/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteNewProductComponent } from '../delete-new-product/delete-new-product.component';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../../categories/_service/categories.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  products: any = [];
  isLoading$: any;
  search:any = null;
  categorie:any = '';

  categories:any = [];
 
  constructor(
    public _productService: productService,
    public router:Router,
    public modalService: NgbModal,
    public toaster: Toaster,
    public _categorieService:CategoriesService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this._productService.allProducts().subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products;
      this.categories = resp.categories;
      this.loadServices();
    })
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
  }

  allProducts(){

    this._productService.allProducts(this.search, this.categorie).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products;
    })
  }

  refresh(){
    this.categorie = null;
    this.search = null;
    this.allProducts();
  }

    editProduct(product){
      this.router.navigateByUrl("/productos/editar-producto/"+product._id);
    }
    deleteProduct(product){
      const modalRef = this.modalService.open(DeleteNewProductComponent,{centered:true, size: 'sm'});
      modalRef.componentInstance.product = product;
  
      modalRef.componentInstance.ProductD.subscribe((resp:any) => {
        let index = this.products.findIndex(item => item._id == product._id);
        if(index != -1){
          this.products.splice(index,1);
          this.toaster.open(NoticyAlertComponent,{text:`primary-'El producto se elimino correctamente'`});
        }
      })
    }
}
