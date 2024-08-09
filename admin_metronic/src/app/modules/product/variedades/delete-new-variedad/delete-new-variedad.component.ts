import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { productService } from '../../_services/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-new-variedad',
  templateUrl: './delete-new-variedad.component.html',
  styleUrls: ['./delete-new-variedad.component.scss']
})
export class DeleteNewVariedadComponent implements OnInit {

  @Output() VariedadD: EventEmitter<any> = new EventEmitter();
  @Input() variedad:any;


  constructor(
    public modal: NgbActiveModal,
    public productServie: productService,
    public toaster: Toaster,
  ) { 
    
  }

  ngOnInit(): void {
  }
  delete(){
    this.productServie.deleteVariedad(this.variedad._id).subscribe((resp:any) => {
      console.log(resp);
      this.VariedadD.emit("");
      this.modal.close();
    }, (error) => {
      if (error.error) {
        this.toaster.open(NoticyAlertComponent,{text: `danger- '${error.error.message}'`});
      }
    })
  }
}
