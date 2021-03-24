import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent implements OnInit {

  public addressID = "";
  public addressID1 = "";
  public addressID2 = "";
  public street = "";
  public block = "";
  public city = "";
  public zipCode = "";
  public county = "";
  public state = "";
  public country = "";
  public taxCode = "";
  public streetNo = "";


  constructor() { }

  ngOnInit() {
  }

}
