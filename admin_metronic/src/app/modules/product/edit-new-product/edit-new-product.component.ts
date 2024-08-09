import { Component, OnInit } from '@angular/core';
import { productService } from '../_services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../categories/_service/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditNewVariedadComponent } from '../variedades/edit-new-variedad/edit-new-variedad.component';
import { DeleteNewVariedadComponent } from '../variedades/delete-new-variedad/delete-new-variedad.component';
import { DeleteGaleriaImagenComponent } from '../delete-galeria-imagen/delete-galeria-imagen.component';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {
  
  product_id:any = null;
  product_selected:any = null;
  
  title:any = null;
  sku: any = null;
  categories:any = [];
  categorie: any = "";
  price_pesos:any = 0;
  price_usd:any = 0;
  imagen_file:any = null;
  imagen_previsualizacion:any = null;
  description:any = null;
  resumen:any = null;
  state:any = 1;
  //
  tag:any = null;
  tags:any = [];

  isLoading$:any;
  type_inventario:any = 1;
  stock:any = 0;

  stock_multiple:any = 0;
  valor_multiple:any = "";

  variedades: any = [];

  imagen_previs_galeria:any = null;
  imagen_file_galeria:any = null;
  galerias:any = [];

  constructor(
    public _productService:productService,
    public router:Router,
    public _categorieService: CategoriesService,
    public activeRouter: ActivatedRoute,
    public toaster: Toaster,
    public modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.activeRouter.params.subscribe((resp:any) =>{
      console.log(resp);
      this.product_id = resp.id;
    });
  
    this._productService.showProduct(this.product_id).subscribe((resp:any) =>{
      console.log(resp);
      this.product_selected = resp.product;

      this.title = this.product_selected.title;
      this.sku = this.product_selected.sku;
      this.categorie = this.product_selected.categorie._id;
      this.price_pesos = this.product_selected.price_pesos;
      this.price_usd = this.product_selected.price_usd;

      this.stock = this.product_selected.stock;
      
      this.imagen_previsualizacion = this.product_selected.imagen;
      this.description = this.product_selected.description;
      this.resumen = this.product_selected.resumen;
      this.tags = this.product_selected.tags;
      this.variedades = this.product_selected.variedades;
      this.type_inventario = this.product_selected.type_inventario;
      this.state = this.product_selected.state;
      this.galerias = this.product_selected.galerias;
    })

    this._categorieService.allCategories().subscribe((resp:any) => {
      console.log(resp);
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

  processFile($event){
    console.log($event.target);
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagen_previsualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previsualizacion = reader.result;
    this.loadServices();
  }

  processFileGaleria($event){
    console.log($event.target);
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagen_previs_galeria = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagen_file_galeria = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file_galeria);
    reader.onloadend = () => this.imagen_previs_galeria = reader.result;
    this.loadServices();
  }
  
  addTag(){
    this.tags.push(this.tag);
    this.tag = "";
  }
  removeTag(i){
    this.tags.splice(i,1);
  }
  update(){
    if (!this.title || !this.categorie || !this.price_usd || !this.price_pesos || !this.resumen || !this.description
        || !this.sku || this.tags.length == 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesitas ingresar todos los campos del formulario.'`});
      return;
    }
    let formData = new FormData();
    formData.append("_id",this.product_id);
    formData.append("title",this.title);
    formData.append("categorie",this.categorie);
    formData.append("sku", this.sku);
    formData.append("price_usd", this.price_usd);
    formData.append("price_pesos", this.price_pesos);
    formData.append("description", this.description);
    formData.append("resumen", this.resumen);
    formData.append("state",this.state);
    formData.append("type_inventario",this.type_inventario);
    formData.append("tags", JSON.stringify(this.tags));
    formData.append("stock",this.stock);

    if (this.imagen_file) {
      formData.append("imagen",this.imagen_file);
    }
   

    this._productService.updateProduct(formData).subscribe((resp:any) => {
      console.log(resp);
      if (resp.code == 403 ) {
        this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! El producto ya existe, digita otro nombre.'`});
      return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'El producto se edito con exito'`});
       
        return;
      }
    })
  }
  listProducts(){
    this.router.navigateByUrl("/productos/lista-de-todo-los-productos");
  }

  checkedInventario(value){
    this.type_inventario = value;
  }

    saveVariedad(){
      if(!this.valor_multiple ||
         !this.stock_multiple) {
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Es necesario digitar un valor y una cantidad'`});

        return;
      }
      let data = {
        product: this.product_id,
        valor: this.valor_multiple,
        stock: this.stock_multiple,
      }
      this._productService.createVariedad(data).subscribe((resp:any) => {
        console.log(resp);

        this.valor_multiple = null;
        this.stock_multiple = null;
        let index = this.variedades.findIndex (item => item._id == resp.variedad._id);
      if (index != -1) {
        this.variedades[index] = resp.variedad;
        this.toaster.open(NoticyAlertComponent,{text:`primary-'La variedad se editó correctamente'`});

      }else{
        this.variedades.unshift(resp.variedad);
        this.toaster.open(NoticyAlertComponent,{text:`primary-'La variedad se registró correctamente'`});
      }
      })
    }
    editVariedad(variedad){
       const modalRef = this.modalService.open(EditNewVariedadComponent,{centered: true,size: 'sm'});
    modalRef.componentInstance.variedad = variedad;
    modalRef.componentInstance.VariedadE.subscribe((variedadE:any) =>{
      let index = this.variedades.findIndex (item => item._id == variedadE._id);
      if (index != -1) {
        this.variedades[index] = variedadE;
        this.toaster.open(NoticyAlertComponent,{text:`primary-'La variedad se editó correctamente'`});

      }
    })
    }
    deleteVariedad(variedad){
     const modalRef = this.modalService.open(DeleteNewVariedadComponent,{centered: true,size: 'sm'});
    modalRef.componentInstance.variedad = variedad;
    
    modalRef.componentInstance.VariedadD.subscribe((resp:any) =>{
      let index = this.variedades.findIndex (item => item._id == variedad._id);
      if (index != -1) {
        this.variedades.splice(index,1);
        this.toaster.open(NoticyAlertComponent,{text:`primary-'La variedad se eliminó correctamente'`});
      }
    })
  }

    storeImagen(){
     if(!this.imagen_file_galeria){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'NECESITAS SELECCIONAR UNA IMAGEN'`});
      return;
    }
    let formData = new FormData();
    formData.append("_id",this.product_id);
    formData.append("imagen",this.imagen_file_galeria);
    formData.append("__id",new Date().getTime().toString());
    this._productService.createGaleria(formData).subscribe((resp:any) => {
      console.log(resp);
      this.imagen_file_galeria = null;
      this.imagen_previs_galeria = null;
      this.galerias.unshift(resp.imagen);
      })
    }

    removeImagen(imagen){
      const modalRef = this.modalService.open(DeleteGaleriaImagenComponent,{centered: true,size: 'sm'});
      modalRef.componentInstance.imagen = imagen;
      modalRef.componentInstance.product_id = this.product_id;
      
      modalRef.componentInstance.ImagenD.subscribe((resp:any) =>{
        let index = this.galerias.findIndex (item => item._id == imagen._id);
        if (index != -1) {
          this.galerias.splice(index,1);
          this.toaster.open(NoticyAlertComponent,{text:`primary-'La imagen se eliminó correctamente'`});
        }
      })
    }
}