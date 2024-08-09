import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit  {

  listCarts:any = [];

  totalCarts:any = 0;
  user:any;

  search_product:any = null;
  products_search:any = [];

  source:any;
  @ViewChild("filter") filter?:ElementRef;

  constructor(
    public router: Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.user = this.cartService._authService.user;
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:any,item:any) => sum + item.total, 0);
    })
    if(this.cartService._authService.user){
      this.cartService.lisCarts(this.cartService._authService.user._id).subscribe((resp:any) => {
        console.log(resp);
        // this.listCarts = resp.carts;
        resp.carts.forEach((cart:any) => {
          this.cartService.changeCart(cart);
        });
      })
    }
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c:any) => {
      //console.log(this.search_product);
      let data = {
        search_product: this.search_product,
      }
      if(this.search_product.length > 1){
        this.cartService.searchProduct(data).subscribe((resp:any) => {
          console.log(resp);
          this.products_search = resp.products;
        })
      }
    })
  }

  isHome(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }
  logout(){
    this.cartService._authService.logout();
  }

  getRouterDiscount(product:any){
    if(product.campaing_discount){
      return {_id: product.campaing_discount._id};
    }
    return {};
  }

  getDiscountProduct(product:any){
    if(product.campaing_discount){
      if(product.campaing_discount.type_discount == 1){// 1 es porcentaje
        return product.price_usd*product.campaing_discount.discount*0.01;
      }else{// 2 es moneda
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }

  removeCart(cart:any){
    this.cartService.deleteCart(cart._id).subscribe((resp:any) =>{
      console.log(resp);
      this.cartService.removeItemCart(cart);
    })
  }

  searchProduct(){

  }
}
