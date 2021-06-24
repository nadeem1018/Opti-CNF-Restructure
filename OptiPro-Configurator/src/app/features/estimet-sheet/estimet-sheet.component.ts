import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { EstimatetoolService } from 'src/app/core/service/estimationtool'

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



  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: EstimatetoolService) { }

  ngOnInit() {
    this.openGridTab('', 'Material');
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
      'OPTM_GROUP': "Labor",
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
      'OPTM_GROUP': "Shipping",
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
      'OPTM_GROUP': "Travel",
      'OPTM_LINENO': this.travelIndex + 1,
      'rowIndex': this.travelIndex
    })

    this.travelIndex = this.travelIndex + 1;
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
    this.showLookupLoader = false;

  }



  fetchFullProducts(productCode: any) {
    this.resetFields();
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
    if (this.gridData[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.gridData[rowIndex]["OPTM_MARKUP"] != "") {
      this.gridData[rowIndex]["OPTM_AMOUNT"] = (parseFloat(this.gridData[rowIndex]["OPTM_PROJECTED_COST"]) + (parseFloat(this.gridData[rowIndex]["OPTM_PROJECTED_COST"]) * (parseFloat(this.gridData[rowIndex]["OPTM_MARKUP"]) / 100))).toFixed(2)
    }
  }

  onLaborChange(rowIndex: any, value: any, key: any) {
    this.laborGrid[rowIndex][key] = value;
    if (this.laborGrid[rowIndex]["OPTM_PER_UNIT_PRICE"] != "" && this.laborGrid[rowIndex]["OPTM_QUANTITY"] != "") {
      this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"] = (parseFloat(this.laborGrid[rowIndex]["OPTM_PER_UNIT_PRICE"]) * parseFloat(this.laborGrid[rowIndex]["OPTM_QUANTITY"])).toFixed(2)
    }
    if (this.laborGrid[rowIndex]["OPTM_PROJECTED_COST"] != "" && this.laborGrid[rowIndex]["OPTM_MARKUP"] != "") {
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

}
