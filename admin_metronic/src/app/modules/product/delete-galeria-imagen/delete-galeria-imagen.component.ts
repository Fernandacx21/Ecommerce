import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { productService } from '../_services/product.service';

@Component({
  selector: 'app-delete-galeria-imagen',
  templateUrl: './delete-galeria-imagen.component.html',
  styleUrls: ['./delete-galeria-imagen.component.scss']
})
export class DeleteGaleriaImagenComponent implements OnInit {

  @Output() ImagenD: EventEmitter<any> = new EventEmitter();
  @Input() imagen:any;
  @Input() product_id:any;


  constructor(
    public modal: NgbActiveModal,
    public productService: productService,
    public toaster: Toaster,
  ) { 
    
  }

  ngOnInit(): void {
  }
  delete(){
    let data = {
      _id: this.product_id ,
      __id: this.imagen._id,
    }
    this.productService.deleteGaleria(data).subscribe((resp:any) => {
      console.log(resp);
      this.ImagenD.emit("");
      this.modal.close();
    }, (error) => {
      if (error.error) {
        this.toaster.open(NoticyAlertComponent,{text: `danger- '${error.error.message}'`});
      }
    })
  }
}

