import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CwViewOldComponent } from '../cw-view-old/cw-view.component';
import { NgForm } from '@angular/forms';
import { OutputService } from 'src/app/core/service/output.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent implements OnInit {

  @ViewChild('addressForm', { static: true }) addressForm = NgForm
  @Input() addressDetais: any
  @Input() customerCode: any
  @Input() customerName: any
  @Output() addressdata = new EventEmitter();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public showLookupLoader = false;

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
  public delarCode = "";
  public optmID = 0;


  constructor(private router: Router, private cwComponet: CwViewOldComponent, private service: OutputService, private httpclient: HttpClient, private CommonService: CommonService) { }


  ngOnInit() {
    if (this.addressDetais.length > 0) {
      this.addressID1 = this.addressDetais[0].OPTM_ADDRESS1;
      this.addressID2 = this.addressDetais[0].OPTM_ADDRESS2;
      this.street = this.addressDetais[0].OPTM_STREET;
      this.block = this.addressDetais[0].OPTM_BLOCK;
      this.city = this.addressDetais[0].OPTM_CITY;
      this.zipCode = this.addressDetais[0].OPTM_ZIP;
      this.country = this.addressDetais[0].OPTM_COUNTRY;
   //   this.optmID = this.addressDetais[0].OPTM_ID;
   //   this.streetNo = this.addressDetais[0].OPTM_STREETNO;
   //   this.state = this.addressDetais[0].OPTM_STATE;
   //   this.taxCode = this.addressDetais[0].OPTM_TAXCODE;
    //  this.addressID = this.addressDetais[0].OPTM_ADDRESSID;
    }
  }


  onSubmit(addressInfo: any) {
    let finalsavedata: any = {};
    finalsavedata.OPCONFIG_OUTPUT_DEALER_CUST_ADD = [];
    finalsavedata.OPCONFIG_OUTPUT_DEALER_CUST_ADD.push({
      OPTM_ADDRESSNAME2: this.addressID1,
      OPTM_ADDRESSNAME3: this.addressID2,
      OPTM_STREET: this.street,
      OPTM_BLOCK: this.block,
      OPTM_CITY: this.city,
      OPTM_ZIP: this.zipCode,
      OPTM_COUNTRY: this.country,
      OPTM_ID: this.optmID,
      OPTM_STREETNO: this.streetNo,
      OPTM_STATE: this.state,
      OPTM_TAXCODE: this.taxCode,
      OPTM_ADDRESSID: this.addressID,
      OPTM_CUSTOMERCODE: this.customerCode,
      OPTM_CUSTOMERNAME: this.customerName
    });
    this.addressdata.emit(finalsavedata.OPCONFIG_OUTPUT_DEALER_CUST_ADD);
    this.onCancle();
    this.CommonService.show_notification(this.language.DataSaved, 'success');
    // this.service.SaveCustomerAddressDetails(finalsavedata).subscribe(data => {
    //   this.showLookupLoader = false;
    //   if (data == "7001") {
    //     CommonData.made_changes = false
    //     this.CommonService.RemoveLoggedInUser().subscribe();
    //     this.CommonService.signOut(this.router, 'Sessionout');
    //     return;
    //   }

    //   if (data === "True") {
    //     CommonData.made_changes = false
    //     this.CommonService.show_notification(this.language.DataSaved, 'success');
    //     this.addressdata.emit(finalsavedata.OPCONFIG_OUTPUT_DEALER_CUST_ADD);
    //     this.onCancle();


    //     return;
    //   } else if (data == "AlreadyExist") {

    //     this.CommonService.show_notification(this.language.DuplicateCode, 'error');
    //     return;
    //   }
    //   else {
    //     this.CommonService.show_notification(this.language.DataNotSaved, 'error');
    //     return;
    //   }
    // },
    //   error => {
    //     if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
    //       this.CommonService.isUnauthorized();
    //     }
    //     return;
    //   }
    // )
  }

  onCancle() {
    this.cwComponet.customerShippingAddress = false;
  }

}
