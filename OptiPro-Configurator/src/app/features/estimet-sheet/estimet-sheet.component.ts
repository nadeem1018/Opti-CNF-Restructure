import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { EstimatetoolService } from 'src/app/core/service/estimationtool'
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-estimet-sheet',
  templateUrl: './estimet-sheet.component.html',
  styleUrls: ['./estimet-sheet.component.scss']
})
export class EstimetSheetComponent implements OnInit {
  public nXP_Chandler_Site: any = ""
  public part_Number: any = "";
  public Project_Description: any = "";
  public quantity: any = "";
  public sales_Representative: any = "";
  public Phone_Number: any = "";
  public project_email: any = "";
  public estimator: any = "";
  public estimate_Number: any = "";
  public shipping: any = "";
  public warehouse_Manager: any = "";
  public shipping_Address_1: any = "";
  public shipping_Address_2: any = "";
  public city: any = "";
  public state: any = "";
  public zip: any = "";
  public Phone_1: any = "";
  public phone_2: any = "";
  public shipping_email: any = "";
  public estimate_Due_Date: any = "";
  public project_Due_Date: any = "";
  public submittal_Required: any = "";
  public submittal_Due_Date: any = "";
  public ready_to_Ship_Date: any = "";
  public on_site_date: any = "";
  public alp: any = "";
  public total_Cost: any = "";
  public per_Unit_Cost: any = "";
  public subtotal: any = "";
  public overhead: any = "";
  public expedite_Fee: any = "";
  public total_Price: any = "";
  public per_Unit_Price: any = "";
  public commonData = new CommonData();
  public product_code: any = "";
  public serviceData = [];
  public lookupfor = "";
  public showLookupLoader = false;
  public gridData: any = [];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public index: any = 0;
  public laborGrid: any = [];
  public travelGrid: any = [];
  public shippingGrid: any = [];
  public laborIndex: any = 0;
  public travelIndex: any = 0;
  public shippingIndex: any = 0;
  public onSiteGrid: any = [];
  public siteLaborIndex: any = 0;
  public OPCONFIG_EST_HEADER: any = [];
  public OPCONFIG_EST_LABOR: any = [];
  public OPCONFIG_EST_MATERIAL: any = [];
  public subContractingGrid: any = [];
  public subContractingindex: any = 0;




  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: EstimatetoolService) { }

  ngOnInit() {
    // this.openGridTab('', 'Material');
  }

  openGridTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    if (evt != "") {
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      evt.currentTarget.className += " active";
    }

    document.getElementById(cityName).style.display = "block";

  }

  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    CommonData.made_changes = true;
    this.product_code = $event[2];
    let productCode = $event[2];
    this.lookupfor = "";
    this.fetchFullProducts(productCode);

  }

  addRow() {
    this.gridData.push({
      'OPTM_MATERIAL': "",
      'OPTM_THICKNESS': "",
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_LENGTH': "",
      'OPTM_WIDTH': "",
      'OPTM_MANUFACTURER': "",
      'OPTM_PART_NUMBER': "",
      'OPTM_VENDOR': "",
      'OPTM_LEAD_TIME': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LINENO': this.index + 1,
      'rowIndex': this.index
    })
    this.index = this.index + 1;
  }

  addLaborRow() {
    this.laborGrid.push({
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LABOR': "",
      'GROUP_NAME': "Labor",
      'OPTM_LINENO': this.laborIndex + 1,
      'rowIndex': this.laborIndex
    })

    this.laborIndex = this.laborIndex + 1;
  }


  addshippingRow() {
    this.shippingGrid.push({
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LABOR': "",
      'GROUP_NAME': "Shipping",
      'OPTM_LINENO': this.shippingIndex + 1,
      'rowIndex': this.shippingIndex
    })

    this.shippingIndex = this.shippingIndex + 1;
  }

  addTravelRow() {
    this.travelGrid.push({
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LABOR': "",
      'GROUP_NAME': "Travel",
      'OPTM_LINENO': this.travelIndex + 1,
      'rowIndex': this.travelIndex
    })

    this.travelIndex = this.travelIndex + 1;
  }

  addsubcontracting() {
    this.subContractingGrid.push({
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LABOR': "",
      'GROUP_NAME': "SubContracting",
      'OPTM_LINENO': this.subContractingindex + 1,
      'rowIndex': this.subContractingindex
    })

    this.subContractingindex = this.subContractingindex + 1;

  }

  addSiteLaborRow() {
    this.onSiteGrid.push({
      'OPTM_DESCRIPTION': "",
      'OPTM_QUANTITY': "",
      'OPTM_PER_UNIT_PRICE': "",
      'OPTM_MARKUP': "",
      'OPTM_PROJECTED_COST': "",
      'OPTM_AMOUNT': "",
      'OPTM_LABOR': "",
      'GROUP_NAME': "Travel",
      'OPTM_LINENO': this.siteLaborIndex + 1,
      'rowIndex': this.siteLaborIndex
    })

    this.siteLaborIndex = this.siteLaborIndex + 1;
  }

  resetFields() {
    this.shippingGrid = [];
    this.travelGrid = [];
    this.laborGrid = [];
    this.gridData = [];
    this.index = 0;
    this.laborIndex = 0;
    this.travelIndex = 0;
    this.shippingIndex = 0;
    this.nXP_Chandler_Site = ""
    this.part_Number = "";
    this.Project_Description = "";
    this.quantity = "";
    this.sales_Representative = "";
    this.Phone_Number = "";
    this.project_email = "";
    this.estimator = "";
    this.estimate_Number = "";
    this.shipping = "";
    this.warehouse_Manager = "";
    this.shipping_Address_1 = "";
    this.shipping_Address_2 = "";
    this.city = "";
    this.Phone_1 = "";
    this.phone_2 = "";
    this.shipping_email = "";
    this.estimate_Due_Date = "";
    this.project_Due_Date = "";
    this.submittal_Required = "";
    this.submittal_Due_Date = "";
    this.ready_to_Ship_Date = "";
    this.on_site_date = "";
    this.alp = "";
    this.total_Cost = "";
    this.per_Unit_Cost = "";
    this.subtotal = "";
    this.overhead = "";
    this.expedite_Fee = "";
    this.total_Price = "";
    this.per_Unit_Price = "";
    this.product_code = "";
    this.serviceData = [];
    this.lookupfor = "";
    this.state = "";
    this.zip = "";
    this.showLookupLoader = false;

  }



  fetchFullProducts(productCode: any) {
    this.shippingGrid = [];
    this.travelGrid = [];
    this.laborGrid = [];
    this.gridData = [];
    this.index = 0;
    this.laborIndex = 0;
    this.travelIndex = 0;
    this.shippingIndex = 0;
    this.showLookupLoader = true;
    this.service.getEstimateDetails(productCode).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data != undefined) {
          for (let i = 0; i < data.EstimateMaterialDetails.length; i++) {
            this.laborGrid.push(data.EstimateMaterialDetails[i]);
            this.laborGrid[i]['rowIndex'] = i;
            this.laborGrid[i]['OPTM_MARKUP'] = "";
            this.laborGrid[i]['OPTM_LINENO'] = i + 1;
          }
          for (let i = 0; i < data.EstimateMateriaHeader.length; i++) {
            this.gridData.push(data.EstimateMateriaHeader[i]);
            this.gridData[i]['rowIndex'] = i;
            this.gridData[i]['OPTM_MARKUP'] = "";
          }

        }
        else {


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

  onChange(rowIndex: any, value: any, key: any) {
    this.gridData[rowIndex][key] = value;
    if (this.gridData[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.gridData[rowIndex]["OPTM_QUANTITY"] != "") {
      this.gridData[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.gridData[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.gridData[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.gridData[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.gridData[rowIndex]["OPTM_MARKUP"] != "" && this.gridData[rowIndex]["OPTM_MARKUP"] != undefined) {
      this.gridData[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.gridData[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.gridData[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.gridData[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  onSubContractChange(rowIndex: any, value: any, key: any)
  {
    this.subContractingGrid[rowIndex][key] = value;
    if (this.subContractingGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.subContractingGrid[rowIndex]["OPTM_QUANTITY"] != "") {
      this.subContractingGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.subContractingGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.subContractingGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.subContractingGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.subContractingGrid[rowIndex]["OPTM_MARKUP"] != "" && this.subContractingGrid[rowIndex]["OPTM_MARKUP"] != undefined) {
      this.subContractingGrid[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.subContractingGrid[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.subContractingGrid[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.subContractingGrid[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  onSiteLbrChange(rowIndex: any, value: any, key: any) {
    this.onSiteGrid[rowIndex][key] = value;
    if (this.onSiteGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.onSiteGrid[rowIndex]["OPTM_QUANTITY"] != "") {
      this.onSiteGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.onSiteGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.onSiteGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.onSiteGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.onSiteGrid[rowIndex]["OPTM_MARKUP"] != "" && this.onSiteGrid[rowIndex]["OPTM_MARKUP"] != undefined) {
      this.onSiteGrid[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.onSiteGrid[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.onSiteGrid[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.onSiteGrid[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  onLaborChange(rowIndex: any, value: any, key: any) {
    this.laborGrid[rowIndex][key] = value;
    if (this.laborGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.laborGrid[rowIndex]["OPTM_QUANTITY"] != "" && this.laborGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != undefined) {
      this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.laborGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.laborGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.laborGrid[rowIndex]["OPTM_MARKUP"] != "" && this.laborGrid[rowIndex]["OPTM_MARKUP"] != undefined && this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"] != undefined) {
      this.laborGrid[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.laborGrid[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  onShippingChange(rowIndex: any, value: any, key: any) {
    this.shippingGrid[rowIndex][key] = value;
    if (this.shippingGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.shippingGrid[rowIndex]["OPTM_QUANTITY"] != "") {
      this.shippingGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.shippingGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.shippingGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.shippingGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.shippingGrid[rowIndex]["OPTM_MARKUP"] != "") {
      this.shippingGrid[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.shippingGrid[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.shippingGrid[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.shippingGrid[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  ontravelChange(rowIndex: any, value: any, key: any) {
    this.travelGrid[rowIndex][key] = value;
    if (this.travelGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.travelGrid[rowIndex]["OPTM_QUANTITY"] != "") {
      this.travelGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.travelGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.travelGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.travelGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.travelGrid[rowIndex]["OPTM_MARKUP"] != "") {
      this.travelGrid[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.travelGrid[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.travelGrid[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.travelGrid[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  fetchProducts() {
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'Product_Details';
    this.showLookupLoader = true;
    this.service.getProductlDetails().subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
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

  onSave() {
    this.OPCONFIG_EST_HEADER = [];
    this.OPCONFIG_EST_LABOR = [];
    this.OPCONFIG_EST_MATERIAL = [];

    this.OPCONFIG_EST_HEADER.push({
      "OPTM_CUSTOMER": this.nXP_Chandler_Site,
      "OPTM_CODE": this.product_code,
      "OPTM_SHIPPING": this.shipping,
      "OPTM_WAREHPUSE_MGR": this.warehouse_Manager,
      "OPTM_SHIP_ADD1": this.shipping_Address_1,
      "OPTM_SHIP_ADD2": this.shipping_Address_2,
      "OPTM_CITY": this.city,
      "OPTM_STATE": this.state,
      "OPTM_ZIP": this.zip,
      "OPTM_PHONE1": this.Phone_1,
      "OPTM_PHONE2": this.phone_2,
      "OPTM_SHIP_EMAIL": this.shipping_email,
      "OPTM_PARTNO": this.part_Number,
      "OPTM_PROJECT_DESC": this.Project_Description,
      "OPTM_QUANTITY": this.quantity,
      "OPTM_SALES_REP": this.sales_Representative,
      "OPTM_PROJECT_PHONE": this.Phone_Number,
      "OPTM_PROJECT_EMAIL": this.project_email,
      " OPTM_ESTIMATOR": this.estimator,
      "OPTM_ESTIMATOR_NO": this.estimate_Number,
      "OPTM_ESTIMATE_DUEDT": this.estimate_Due_Date,
      "OPTM_PROJECT_DUEDT": this.project_Due_Date,
      "OPTM_SUBMITTAL_REQ": this.submittal_Required,
      "OPTM_SUBMITTAL_DUEDT": this.submittal_Due_Date,
      "OPTM_REDY_TO_SHIPDT": this.ready_to_Ship_Date,
      "OPTM_ANTICIPATED_LG": this.alp,
      "OPTM_ONSITEDT": this.on_site_date,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser"),
      CompanyDBID: sessionStorage.getItem("selectedComp")
    })

    this.OPCONFIG_EST_MATERIAL = this.gridData;
    if (this.laborGrid.length > 0) {
      for (let i = 0; i < this.laborGrid.length; i++) {
        this.laborGrid[i]['GROUP_NAME'] = "Labor"
        this.OPCONFIG_EST_LABOR.push(this.laborGrid[i]);
      }
    }
    if (this.travelGrid.length > 0) {
      for (let i = 0; i < this.travelGrid.length; i++) {
        this.travelGrid[i]['OPTM_CODE'] = this.product_code;
        this.OPCONFIG_EST_LABOR.push(this.travelGrid[i]);
      }
    }
    if (this.onSiteGrid.length > 0) {
      for (let i = 0; i < this.onSiteGrid.length; i++) {
        this.onSiteGrid[i]['OPTM_CODE'] = this.product_code;
        this.OPCONFIG_EST_LABOR.push(this.onSiteGrid[i]);
      }
    }
    if (this.shippingGrid.length > 0) {
      for (let i = 0; i < this.shippingGrid.length; i++) {
        this.shippingGrid[i]['OPTM_CODE'] = this.product_code;
        this.OPCONFIG_EST_LABOR.push(this.shippingGrid[i]);
      }
    }

    if (this.subContractingGrid.length > 0) {
      for (let i = 0; i < this.subContractingGrid.length; i++) {
        this.subContractingGrid[i]['OPTM_CODE'] = this.product_code;
        this.OPCONFIG_EST_LABOR.push(this.subContractingGrid[i]);
      }
    }

    this.showLookupLoader = true;
    this.service.SaveEstimateMaster(this.OPCONFIG_EST_HEADER, this.OPCONFIG_EST_MATERIAL, this.OPCONFIG_EST_LABOR).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data === "True") {
          CommonData.made_changes = false
          this.CommonService.show_notification(this.language.DataSaved, 'success');
          this.resetFields();
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

}
