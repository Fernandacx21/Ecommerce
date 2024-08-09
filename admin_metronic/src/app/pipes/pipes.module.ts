import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafehtmlPipe } from './safehtml.pipe';
import { SafeurlPipe } from './safeurl.pipe';
// import { TranslateyPipe } from './translatey.pipe';



@NgModule({
  declarations: [SafehtmlPipe, SafeurlPipe],
  imports: [
    CommonModule
  ],
  exports: [
    SafehtmlPipe,
    SafeurlPipe,
  ]
})
export class PipesModule { }
