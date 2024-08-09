import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CuponeService } from '../_services/cupone.service';
import { DeleteNewCuponeComponent } from '../delete-new-cupone/delete-new-cupone.component';

@Component({
  selector: 'app-list-cupone',
  templateUrl: './list-cupone.component.html',
  styleUrls: ['./list-cupone.component.scss']
})
export class ListCuponeComponent implements OnInit {
  
  isLoading$ :any = null;
  search:any = "";
  cupones:any = [];
  constructor(
    public _cuponService: CuponeService,
    public router:Router,
    public modalService:NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponService.isLoading$;
    this.allCupons();
  }
  allCupons(){
    this._cuponService.allCupons(this.search).subscribe((resp:any) => {
      console.log(resp);
      this.cupones = resp.cupones;
    })
  }
  refresh(){
    this.search = "";
    this.allCupons();
  }
  editCupon(cupon){
    this.router.navigateByUrl("/cupones/editar-cupon/"+cupon._id);
  }
  delete(cupon){
    const modalRef = this.modalService.open(DeleteNewCuponeComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.cupon_selected = cupon;

    modalRef.componentInstance.CuponD.subscribe((resp:any) => {
      let index = this.cupones.findIndex(item => item._id == cupon._id);
      if(index != -1){
        this.cupones.splice(index,1);
      }
    })
  }
}
