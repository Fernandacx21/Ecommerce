import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing.module';
import { SlidersComponent } from './sliders.component';
import { AddNewSliderComponent } from './add-new-slider/add-new-slider.component';
import { EditNewSliderComponent } from './edit-new-slider/edit-new-slider.component';
import { DeleteNewSliderComponent } from './delete-new-slider/delete-new-slider.component';
import { ListSliderComponent } from './list-slider/list-slider.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';


@NgModule({
  declarations: [SlidersComponent, AddNewSliderComponent, EditNewSliderComponent, DeleteNewSliderComponent, ListSliderComponent],
  imports: [
    CommonModule,
    SlidersRoutingModule,
    //
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
export class SlidersModule { }
