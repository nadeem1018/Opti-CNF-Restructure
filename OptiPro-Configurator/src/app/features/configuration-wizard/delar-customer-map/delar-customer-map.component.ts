import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delar-customer-map',
  templateUrl: './delar-customer-map.component.html',
  styleUrls: ['./delar-customer-map.component.scss']
})
export class DelarCustomerMapComponent implements OnInit {

  @ViewChild('delarCustomerForm', { static: true }) delarCustomerForm: NgForm
  delarList: DelarVaribleList = new DelarVaribleList();



  constructor() { }

  ngOnInit() {
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
