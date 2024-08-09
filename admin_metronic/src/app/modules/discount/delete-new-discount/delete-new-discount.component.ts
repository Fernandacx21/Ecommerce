import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';

@Component({
  selector: 'app-delete-new-discount',
  templateUrl: './delete-new-discount.component.html',
  styleUrls: ['./delete-new-discount.component.scss']
})
export class DeleteNewDiscountComponent implements OnInit {

  @Output() DiscountD: EventEmitter<any> = new EventEmitter();
  @Input() discount_selected:any;

  constructor(
    public modal: NgbActiveModal,
    public discountService: DiscountService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
  }


  delete(){
    this.discountService.deleteDiscount(this.discount_selected._id).subscribe((resp:any) => {
      console.log(resp);
      this.DiscountD.emit("");
      this.toaster.open(NoticyAlertComponent,{text:`success-'EL DESCUENTO  SE ELIMINO CORRECTAMENTE.'`});
      this.modal.close();
    }, (error) => {
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${error.error.message}'`});
      }
    })
  }

}
