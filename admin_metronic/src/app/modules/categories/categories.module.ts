import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { AddNewCategorieComponent } from './add-new-categorie/add-new-categorie.component';
import { EditNewCategorieComponent } from './edit-new-categorie/edit-new-categorie.component';
import { DeleteNewCategorieComponent } from './delete-new-categorie/delete-new-categorie.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';


@NgModule({
  declarations: [CategoriesComponent, AddNewCategorieComponent, EditNewCategorieComponent, DeleteNewCategorieComponent, ListCategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
  ]
})
export class CategoriesModule { }
