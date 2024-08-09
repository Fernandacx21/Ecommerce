import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';
declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {

  sale_orders:any = []

  is_detail_sale:any = false;

  order_selected:any = null;
  //DIRECCION
  listAdressClient:any = [];
  name:any = null;
  surname:any = null;
  address:any = null;
  referencia:any = null;
  region:any = null;
  ciudad:any = null;
  telefono:any = null;
  email:any = null;
  nota:any = null;
  pais:any = 'Mexico'; 
  address_client_selected:any = null;

  // DATOS DEL CLIENTE
  name_c:any = null;
  surname_c:any = null;
  email_c:any = null;
  password:any = null;
  password_repet:any = null;
  // Review
  cantidad:any = 0;
  description:any = null;
  sale_detail_selected:any = null;
  constructor(
    public authEcommerceService:EcommerceAuthService,
  ) { }

  ngOnInit(): void {
    this.showProfileClient();
    this.name_c = this.authEcommerceService.authService.user.name ;
    this.surname_c = this.authEcommerceService.authService.user.surname ;
    this.email_c = this.authEcommerceService.authService.user.email;
  }
  showProfileClient(){
    let data = {
      user_id: this.authEcommerceService.authService.user._id,
    }
    this.authEcommerceService.showProfileClient(data).subscribe((resp:any) => {
      console.log(resp);
      this.sale_orders = resp.sale_orders;
      this.listAdressClient = resp.address_client;
    })
  }

  getDate(date:any){
    let newDate = new Date(date);

    return `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`;
  }

  viewDetailSale(order:any){
    this.is_detail_sale = true;
    this.order_selected = order;
  }

  goHome(){
    this.is_detail_sale = false;
    this.order_selected = null;
  }

  store(){
    if(this.address_client_selected){
      this.updateAddress();
    }else{
      this.registerAddress();
    }
  }

  registerAddress(){
    if(!this.name ||
      !this.surname
      || !this.address
      || !this.region
      || !this.ciudad
      || !this.telefono
      || !this.email ||
      !this.pais){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN");
      return;
    }
    let data = {
      user: this.authEcommerceService.authService.user._id,
      name: this.name,
      surname: this.surname,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
      pais: this.pais,
    };
    this.authEcommerceService.registerAddressClient(data).subscribe((resp:any) => {
      console.log(resp);
      this.listAdressClient.push(resp.address_client);
      alertSuccess(resp.message);
      this.resetFormulario();
    })
  }

  updateAddress(){
    if(!this.name ||
      !this.surname
      || !this.address
      || !this.region
      || !this.ciudad
      || !this.telefono
      || !this.email ||
      !this.pais){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN");
      return;
    }
    let data = {
      _id: this.address_client_selected._id,
      user: this.authEcommerceService.authService.user._id,
      name: this.name,
      surname: this.surname,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
      pais: this.pais,
    };
    this.authEcommerceService.updateAddressClient(data).subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.listAdressClient.findIndex((item:any) => item._id == this.address_client_selected._id);
      this.listAdressClient[INDEX] = resp.address_client;
      alertSuccess(resp.message);
    })
  }

  resetFormulario(){
    this.name = null;
    this.surname = null;
    this.address = null;
    this.referencia = null;
    this.region = null;
    this.ciudad = null;
    this.telefono = null;
    this.email = null;
    this.nota = null;
  }
  newAddress(){
    this.resetFormulario();
    this.address_client_selected = null;
  }
  addressClientSelected(list_address:any){
    this.address_client_selected = list_address;
    this.name = this.address_client_selected.name;
    this.surname = this.address_client_selected.surname;
    this.address = this.address_client_selected.address;
    this.referencia = this.address_client_selected.referencia;
    this.region = this.address_client_selected.region;
    this.ciudad = this.address_client_selected.ciudad;
    this.telefono = this.address_client_selected.telefono;
    this.email = this.address_client_selected.email;
    this.nota = this.address_client_selected.nota;
    this.pais = this.address_client_selected.pais;
  }

  updateProfileClient(){
    // password_repet
    if(this.password){
      if(this.password != this.password_repet){
        alertDanger("LAS CONTRASEÑAS SON INCORRECTAS");
        return;
      }
    }
    let data = {
      _id: this.authEcommerceService.authService.user._id,
      name:this.name_c,
      surname:this.surname_c,
      email:this.email_c,
      password: this.password,
    };
    this.authEcommerceService.updateProfileClient(data).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess(resp.message)
      if(resp.user){
        localStorage.setItem("user",JSON.stringify(resp.user));
      }
    })
  }

  viewReview(sale_detail:any){
    console.log(sale_detail);
    this.sale_detail_selected = sale_detail;
    if(this.sale_detail_selected.review){
      this.cantidad =this.sale_detail_selected.review.cantidad;
      this.description =this.sale_detail_selected.review.description;
    }else{
      this.cantidad =  null;
      this.description = null;
    }
  }
  goDetail(){
    this.sale_detail_selected = null;
  }
  addCantidad(cantidad:number){
    this.cantidad = cantidad;
  }
  save(){
    if(this.sale_detail_selected.review){
      this.updateReview();
    }else{
      this.saveReview();
    }
  }
  saveReview(){
    if(!this.cantidad || !this.description){
      alertDanger("TODOS LOS CAMPOS DEL FORMULARIO RESEÑA SON IMPORTANTES");
      return;
    }
    let data = {
      product: this.sale_detail_selected.product._id,
      sale_detail:this.sale_detail_selected._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.registerProfileClientReview(data).subscribe((resp:any) => {
      console.log(resp);
      this.sale_detail_selected.review = resp.review;
      alertSuccess(resp.message);
    })
  }

  updateReview(){
    if(!this.cantidad || !this.description){
      alertDanger("TODOS LOS CAMPOS DEL FORMULARIO RESEÑA SON IMPORTANTES");
      return;
    }
    let data = {
      _id: this.sale_detail_selected.review._id,
      product: this.sale_detail_selected.product._id,
      sale_detail:this.sale_detail_selected._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.updateProfileClientReview(data).subscribe((resp:any) => {
      console.log(resp);
      this.sale_detail_selected.review = resp.review;
      alertSuccess(resp.message);
    })
  }

  logout(){
    this.authEcommerceService.authService.logout();
  }
}