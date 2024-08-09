import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { AddNewDiscountComponent } from './add-new-discount/add-new-discount.component';
import { EditNewDiscountComponent } from './edit-new-discount/edit-new-discount.component';
import { DeleteNewDiscountComponent } from './delete-new-discount/delete-new-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';


@NgModule({
  declarations: [DiscountComponent, AddNewDiscountComponent, EditNewDiscountComponent, DeleteNewDiscountComponent, ListDiscountComponent],
  imports: [
    CommonModule,
    DiscountRoutingModule,

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
export class DiscountModule { }
