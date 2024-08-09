import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_service/categories.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-edit-new-categorie',
  templateUrl: './edit-new-categorie.component.html',
  styleUrls: ['./edit-new-categorie.component.scss']
})
export class EditNewCategorieComponent implements OnInit {

  @Output() CategorieE: EventEmitter<any> = new EventEmitter();
  @Input() categorie_selected:any;
  isLoading$: any;
  name: any = null;

  imagen_file: any = null;
  imagen_previsualizacion: any = null;
  state: any = null;

  constructor(
    public _categorieService: CategoriesService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.name = this.categorie_selected.title;
    this.state = this.categorie_selected.state;
    this.imagen_previsualizacion = URL_BACKEND+'api/categories/uploads/categorie/'+this.categorie_selected.imagen;
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
  }

  save(){
    console.log(this.name);
    if(!this.name){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
      return;
    }
    let formData = new FormData();
    formData.append('_id',this.categorie_selected._id);
    formData.append('title',this.name);
    formData.append('state',this.state);
    if (this.imagen_file) {
      formData.append('portada',this.imagen_file);
    }

    //
    this._categorieService.updateCategorie(formData).subscribe((resp:any) => {
      console.log(resp);
      this.CategorieE.emit(resp.categorie);
      this.modal.close();
    })
  }

}
