import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';

//Localhots:4200/categories/list
const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'list',
        component: ListCategoriesComponent,
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
