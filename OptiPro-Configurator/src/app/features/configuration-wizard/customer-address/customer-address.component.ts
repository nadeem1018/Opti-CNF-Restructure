import { Component, OnInit } from '@angular/core';
import { CwViewOldComponent } from '../cw-view-old/cw-view.component';

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


  constructor(private cwComponet: CwViewOldComponent) { }

  ngOnInit() {
  }

  onCancle() {
    this.cwComponet.customerShippingAddress = false;
  }

}
