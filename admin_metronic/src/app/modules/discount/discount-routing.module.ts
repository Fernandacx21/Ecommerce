import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewDiscountComponent } from './add-new-discount/add-new-discount.component';
import { DiscountComponent } from './discount.component';
import { EditNewDiscountComponent } from './edit-new-discount/edit-new-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';

const routes: Routes = [{
  path: '',
  component: DiscountComponent,
  children: [
    {
      path: "registrar-descuento",
      component: AddNewDiscountComponent
    },
    {
      path: "editar-descuento/:id",
      component: EditNewDiscountComponent
    },
    {
      path: "listar-descuento",
      component: ListDiscountComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
