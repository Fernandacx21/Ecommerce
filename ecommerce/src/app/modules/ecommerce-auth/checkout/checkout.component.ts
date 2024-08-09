import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../ecommerce-guest/_services/cart.service';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';

declare function alertDanger([]):any;
declare function alertSuccess([]):any;
declare var paypal:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;

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

  listCarts:any = [];
  totalCarts:any = 0;
  constructor(
    public authEcommerce: EcommerceAuthService,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.authEcommerce.listAddressClient(this.authEcommerce.authService.user._id).subscribe((resp:any) => {
      console.log(resp);
      this.listAdressClient = resp.address_client;
    })

    this.cartService.currentDataCart$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:any,item:any) => sum + item.total, 0);
    })

    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },
      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
          if(this.listCarts.length == 0){
            alertDanger("NO SE PUEDE PROCESAR UNA ORDEN SIN NINGUN ELEMENTO DENTRO DEL CARRITO");
            return;
          }
          if(!this.address_client_selected){
            alertDanger("NECESITAS SELECCIONAR UNA DIRECIÓN DE ENVIO");
            return;
          }
          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL ECOMMERCE",
                    value: this.totalCarts
                }
              }
            ]
          };

          return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data:any, actions:any) => {
          
          let Order = await actions.order.capture();
  
          // Order.purchase_units[0].payments.captures[0].id

          let sale = {
            user: this.authEcommerce.authService.user._id,
            currency_payment: 'USD',
            method_payment: 'PAYPAL',
            n_transacccion: Order.purchase_units[0].payments.captures[0].id,
            total: this.totalCarts,
          };

          let sale_address = {
              name: this.name,
              surname: this.surname,
              pais: this.pais,
              address: this.address,
              referencia: this.referencia,
              ciudad: this.ciudad,
              region: this.region,
              telefono: this.telefono,
              email: this.email,
              nota: this.nota,
          }

          this.authEcommerce.registerSale({sale: sale, sale_address: sale_address}).subscribe((resp:any) => {
            console.log(resp);
            alertSuccess(resp.message);
            location.reload();
          })
          // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
    }).render(this.paypalElement?.nativeElement);
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
      user: this.authEcommerce.authService.user._id,
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
    this.authEcommerce.registerAddressClient(data).subscribe((resp:any) => {
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
      user: this.authEcommerce.authService.user._id,
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
    this.authEcommerce.updateAddressClient(data).subscribe((resp:any) => {
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
}
