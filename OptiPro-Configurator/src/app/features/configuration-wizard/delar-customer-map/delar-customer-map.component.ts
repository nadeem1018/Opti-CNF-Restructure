import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CwViewOldComponent } from '../cw-view-old/cw-view.component';

@Component({
  selector: 'app-delar-customer-map',
  templateUrl: './delar-customer-map.component.html',
  styleUrls: ['./delar-customer-map.component.scss']
})
export class DelarCustomerMapComponent implements OnInit {

  @ViewChild('delarCustomerForm', { static: true }) delarCustomerForm = NgForm
  delarList: DelarVaribleList = new DelarVaribleList();
  isDelarmapView = true;



  constructor(private cwComponet: CwViewOldComponent) { }

  ngOnInit() {
  }

  onSubmit(userInfo: any) {
    console.log(userInfo.value);
  }

  onNewScreen() {
    this.delarList = {
      addressID: "",
      addressID1: "",
      addressID2: "",
      street: "",
      block: "",
      city: "",
      zipCode: "",
      email: "",
      country: "",
      name: "",
      contactPerson: "",
      customerCode: "",
    }
  }

  onCancle() {
    this.cwComponet.delarCustomerMap = false;
  }



}


export class DelarVaribleList {
  public addressID: any;
  public addressID1: any;
  public addressID2: any;
  public street: any;
  public block: any;
  public city: any;
  public zipCode: any;
  public email: any;
  public country: any;
  public name: any;
  public contactPerson: any;
  public customerCode: any;
}
