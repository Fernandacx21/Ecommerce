import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';
import { SliderService } from '../_services/slider.service';

@Component({
  selector: 'app-edit-new-slider',
  templateUrl: './edit-new-slider.component.html',
  styleUrls: ['./edit-new-slider.component.scss']
})
export class EditNewSliderComponent implements OnInit {

  @Output() SliderE: EventEmitter<any> = new EventEmitter();
  @Input() slider_selected:any;
  
  isLoading$:any;
  name:any = null;
  link:any = null;
  imagen_file:any = null;
  imagen_previzualizacion:any = null;
  state:any = 1;
  constructor(
    public _sliderService: SliderService,
    public modal:NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.name = this.slider_selected.title;
    this.link = this.slider_selected.link;
    this.state = this.slider_selected.state;
    this.imagen_previzualizacion = URL_BACKEND+'api/sliders/uploads/slider/'+this.slider_selected.imagen;
  }

  processFile($event){
    console.log($event.target);
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagen_previzualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualizacion = reader.result;
  }

  save(){
    console.log(this.name);
    if(!this.name || !this.link){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
      return;
    }
    let formData = new FormData();
    formData.append('_id',this.slider_selected._id);
    formData.append('title',this.name);
    formData.append('link',this.link);
    formData.append('state',this.state);
    formData.append('portada',this.imagen_file);

    // 
    this._sliderService.updateSlider(formData).subscribe((resp:any) => {
      console.log(resp);
      this.SliderE.emit(resp.slider);
      this.modal.close();
    })
  }

}
