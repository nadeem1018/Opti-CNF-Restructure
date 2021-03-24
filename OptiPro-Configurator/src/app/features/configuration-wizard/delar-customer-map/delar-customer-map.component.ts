import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delar-customer-map',
  templateUrl: './delar-customer-map.component.html',
  styleUrls: ['./delar-customer-map.component.scss']
})
export class DelarCustomerMapComponent implements OnInit {

  @ViewChild('delarCustomerForm', { static: false }) delarCustomerForm: NgForm
  delarList: DelarVaribleList;



  constructor() { }

  ngOnInit() {
  }

}


export class DelarVaribleList {
  public addressID = "";
  public addressID1 = "";
  public addressID2 = "";
  public street = "";
  public block = "";
  public city = "";
  public zipCode = "";
  public email = "";
  public country = "";
  public name = "";
  public contactPerson = "";
  public customerCode = "";
}
