import { Component, Input, OnInit } from '@angular/core';
import { Toast } from 'ngx-toast-notifications';

@Component({
  selector: 'app-noticy-alert',
  templateUrl: './noticy-alert.component.html',
  styleUrls: ['./noticy-alert.component.scss']
})
export class NoticyAlertComponent implements OnInit {

  @Input() toast: Toast;

  alert:string = ''
  txt: string = ''
  constructor() { }

  ngOnInit(): void {
    this.alert = this.toast.text.split('-')[0];
    this.txt = this.toast.text.split('-')[1];
  }

}
