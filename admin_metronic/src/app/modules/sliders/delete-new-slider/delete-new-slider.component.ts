import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { SliderService } from '../_services/slider.service';

@Component({
  selector: 'app-delete-new-slider',
  templateUrl: './delete-new-slider.component.html',
  styleUrls: ['./delete-new-slider.component.scss']
})
export class DeleteNewSliderComponent implements OnInit {

  @Output() SliderD: EventEmitter<any> = new EventEmitter();
  @Input() slider_selected:any;

  constructor(
    public modal: NgbActiveModal,
    public sliderService: SliderService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
  }


  delete(){
    this.sliderService.deleteSlider(this.slider_selected._id).subscribe((resp:any) => {
      console.log(resp);
      this.SliderD.emit("");
      this.toaster.open(NoticyAlertComponent,{text:`success-'EL SLIDER  SE ELIMINO CORRECTAMENTE.'`});
      this.modal.close();
    }, (error) => {
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${error.error.message}'`});
      }
    })
  }

}
