import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CwViewOldComponent } from '../cw-view-old/cw-view.component';
import { OutputService } from 'src/app/core/service/output.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';

@Component({
  selector: 'app-delar-customer-map',
  templateUrl: './delar-customer-map.component.html',
  styleUrls: ['./delar-customer-map.component.scss']
})
export class DelarCustomerMapComponent implements OnInit {

  @ViewChild('delarCustomerForm', { static: true }) delarCustomerForm = NgForm
  delarList: DelarVaribleList = new DelarVaribleList();
  @Input() dealerdata: any
  @Output() dealerDetails = new EventEmitter();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  isDelarmapView = true;
  isFieldDisable = true;
  isNewDisable = false;
  isSaveEnable = false;
  isEdit = false;
  iseditDisable = false;
  serviceData = [];
  selectedImage = "";
  lookupfor = "";
  showLookupLoader = false;
  iscustomercodedisable = true;




  constructor(private router: Router, private cwComponet: CwViewOldComponent, private service: OutputService, private httpclient: HttpClient, private CommonService: CommonService) { }

  ngOnInit() {
    if (this.dealerdata.length > 0) {
      this.isEdit = true;
      this.delarList.delarCode = this.dealerdata[0].OPTM_DEALERCODE;
      this.delarList.addressID1 = this.dealerdata[0].OPTM_ADDRESS1;
      this.delarList.addressID2 = this.dealerdata[0].OPTM_ADDRESS2;
      this.delarList.street = this.dealerdata[0].OPTM_STREET;
      this.delarList.block = this.dealerdata[0].OPTM_BLOCK;
      this.delarList.city = this.dealerdata[0].OPTM_CITY;
      this.delarList.zipCode = this.dealerdata[0].OPTM_ZIP;
      this.delarList.email = this.dealerdata[0].OPTM_EMAIL;
      this.delarList.country = this.dealerdata[0].OPTM_COUNTRY;
      this.delarList.name = this.dealerdata[0].OPTM_CUSTOMERNAME;
      this.delarList.contactPerson = this.dealerdata[0].OPTM_CONTACT_PERSON;
      this.delarList.customerCode = this.dealerdata[0].OPTM_CUSTOMERCODE;
      this.delarList.optmID = this.dealerdata[0].OPTM_ID;
      this.delarList.contactNumber = this.dealerdata[0].OPTM_CONTACT_NUMBER;
    }
    else {
      this.isNewDisable = true;
      this.isSaveEnable = true;
      this.isFieldDisable = false;
      this.iscustomercodedisable = false;
      this.delarList.optmID = 0;
    }
  }

  onSubmit(userInfo: any) {
    let finalsavedata: any = {};
    finalsavedata.OPCONFIG_DEALER_CUSTOMER = [];

    finalsavedata.OPCONFIG_DEALER_CUSTOMER.push({
      OPTM_DEALERCODE: this.delarList.delarCode,
      OPTM_ADDRESS1: this.delarList.addressID1,
      OPTM_ADDRESS2: this.delarList.addressID2,
      OPTM_STREET: this.delarList.street,
      OPTM_BLOCK: this.delarList.block,
      OPTM_CITY: this.delarList.city,
      OPTM_ZIP: this.delarList.zipCode,
      OPTM_EMAIL: this.delarList.email,
      OPTM_COUNTRY: this.delarList.country,
      OPTM_CUSTOMERNAME: this.delarList.name,
      OPTM_CONTACT_PERSON: this.delarList.contactPerson,
      OPTM_CUSTOMERCODE: this.delarList.customerCode,
      OPTM_ID: this.delarList.optmID,
      OPTM_CONTACT_NUMBER: this.delarList.contactNumber
    });


    this.service.SaveDelarDetails(finalsavedata).subscribe(data => {
      this.showLookupLoader = false;
      if (data == "7001") {
        CommonData.made_changes = false
        this.CommonService.RemoveLoggedInUser().subscribe();
        this.CommonService.signOut(this.router, 'Sessionout');
        return;
      }

      if (data === "True") {
        CommonData.made_changes = false
        this.CommonService.show_notification(this.language.DataSaved, 'success');
        if (this.isNewDisable) {
          let data = [];
          data.push({ delarCode: this.delarList.customerCode, delarName: this.delarList.name });
          this.dealerDetails.emit(data);
          this.onCancle();
        }
        return;
      } else if (data == "AlreadyExist") {

        this.CommonService.show_notification(this.language.DuplicateCode, 'error');
        return;
      }
      else {
        this.CommonService.show_notification(this.language.DataNotSaved, 'error');
        return;
      }
    },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }


  onNewScreen() {
    this.isNewDisable = true;
    this.isSaveEnable = true;
    this.isFieldDisable = false;
    this.iscustomercodedisable = false;
    this.delarList.optmID = 0;
    this.isEdit = false;
    this.delarList = {
      delarCode: "",
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
      optmID: 0,
      contactNumber: ""
    }
  }

  openEditView() {
    this.isNewDisable = true;
    this.isSaveEnable = true;
    this.iseditDisable = true;
    this.isFieldDisable = false;
  }

  getCustomerList() {

    if (this.iscustomercodedisable) {
      return;
    }

    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'delar_Configure_Customer_List';
    this.service.getCustomerLookUpData().subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          return;
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }

  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    CommonData.made_changes = true;
    if (this.lookupfor == "delar_Configure_Customer_List") {
      this.delarList.delarCode = $event[0];
      this.delarList.name = $event[2];
      this.delarList.customerCode = $event[1];
      // this.delarList.addressID1 = $event[1];
      // this.delarList.addressID2 = $event[1];
      // this.delarList.street = $event[1];
      // this.delarList.block = $event[1];
      // this.delarList.city = $event[1];
      // this.delarList.zipCode = $event[1];
      // this.delarList.email = $event[1];
      // this.delarList.country = $event[1];
      // this.delarList.contactPerson = $event[1];
      // this.delarList.optmID = $event[1];
      // this.delarList.contactNumber = $event[1];
    }
  }

  onCancle() {
    this.cwComponet.delarCustomerMap = false;
  }



}


export class DelarVaribleList {
  public delarCode: any;
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
  public optmID: any;
  public contactNumber: any;
}
