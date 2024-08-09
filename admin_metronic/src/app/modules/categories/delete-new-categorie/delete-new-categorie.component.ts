import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../_service/categories.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-new-categorie',
  templateUrl: './delete-new-categorie.component.html',
  styleUrls: ['./delete-new-categorie.component.scss']
})
export class DeleteNewCategorieComponent implements OnInit {

  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  @Input() categorie_selected:any;


  constructor(
    public modal: NgbActiveModal,
    public categorieService: CategoriesService,
    public toaster: Toaster,
  ) { 
    
  }

  ngOnInit(): void {
  }
  delete(){
    this.categorieService.deleteCategorie(this.categorie_selected._id).subscribe((resp:any) => {
      console.log(resp);
      this.CategorieD.emit("");
      this.toaster.open(NoticyAlertComponent,{text: `success- 'La categoria se elimino correctamente.'`});
      this.modal.close();
    }, (error) => {
      if (error.error) {
        this.toaster.open(NoticyAlertComponent,{text: `danger- '${error.error.message}'`});
      }
    })
  }

}
