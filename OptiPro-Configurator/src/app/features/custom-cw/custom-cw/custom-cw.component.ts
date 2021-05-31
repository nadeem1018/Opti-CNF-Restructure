import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from 'src/app/core/data/CommonData';
import { CommonService } from 'src/app/core/service/common.service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { OutputService } from '../../../core/service/output.service';

@Component({
  selector: 'app-custom-cw',
  templateUrl: './custom-cw.component.html',
  styleUrls: ['./custom-cw.component.scss']
})
export class CustomCwComponent implements OnInit {

  public customer_code: any = "";
  public customer_name: any = "";
  public ship_to_address: any = "";
  public bill_to_address: any = "";
  public lookupfor = "";
  public showLookupLoader = false;
  public serviceData = [];
  public currentrowIndex = 0;
  public currentPage = 1;
  public isColumnFilter: boolean = false;
  public selectedValue: number = 18;
  public skip: number = 0;
  public gridView: GridDataResult;
  record_per_page: any;
  current_page: any = 1;
  public filter: CompositeFilterDescriptor;
  public companyName = sessionStorage.getItem('selectedComp');

  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public dataList: any = [];
  public featureList: any = [];

  constructor(
    private router: Router,
    private CommonService: CommonService,
    private service: OutputService
  ) { }

  public commonData = new CommonData();
  public listItems: Array<string> = this.commonData.default_limits;
  public language = JSON.parse(sessionStorage.getItem('current_lang'));
  public setFinalData: any = [];



  ngOnInit() {
    this.record_per_page = 20;
    // if (sessionStorage.getItem('defaultRecords') !== undefined && sessionStorage.getItem('defaultRecords') != "") {
    //   this.selectedValue = Number(sessionStorage.getItem('defaultRecords'));
    // } else {
    //   this.selectedValue = Number(this.commonData.default_count);
    // }
    if (sessionStorage.isFilterEnabled == "true") {
      this.isColumnFilter = true;
    } else {
      this.isColumnFilter = false;
    }

    this.getFeatureList();
  }

  // function for get customer template list Api .

  getFeatureList() {
    CommonData.made_changes = true;
    this.dataList = [];
    this.service.getCustomCWFeatureList().subscribe(
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
          for (let i = 0; i < data.length; i++) {
            data[i].TotalPrice = parseInt(data[i].Quantity) * parseInt(data[i].Price);
            data[i]["rowindex"] = i;
            data[i]["checked"] = false;
            data[i]["LINENO"] = i+1;
          }
          this.dataList = data;
          this.featureList = data;
          this.loadItems();
        }
        else {
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
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



  // function for page change in grid.

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.selectedValue = event.take;
    this.loadItems();
  }


  // function for filter column and get filter data in grid .

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    let gridData = filterBy(this.dataList, filter);
    this.gridView =
      {
        data: gridData.slice(this.skip, this.skip + this.selectedValue),
        total: gridData.length
      }
  }

  // function for load items  in grid .

  public loadItems(): void {
    this.gridView = {
      data: this.dataList.slice(this.skip, this.skip + this.selectedValue),
      total: this.dataList.length
    };
    console.log(this.gridView);
  }

  // function for get current page of grid .

  getcurrentPageSize(grid_value) {
    sessionStorage.setItem('defaultRecords', grid_value);
    console.log('=sessionStorage=======', sessionStorage.defaultRecords);
    this.skip = 0;
    this.selectedValue = grid_value;
    this.record_per_page = sessionStorage.getItem('defaultRecords');
    this.loadItems();
  }


  // function for set default state for filter
  saveFilterState() {
    sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
  }

  //function for add selected data 

  on_checkbox_checked(value: any, data: any) {
    if (value == true) {
      this.setFinalData.push(data);
    }
    else {
      if (this.setFinalData.length > 0) {
        this.checkExistSetFinalData(data.component);
      }
    }
    data.checked = value;
  }

  //function for check dublicate data on Final Data array and delete 
  checkExistSetFinalData(itemCode: any) {
    let array = this.setFinalData;
    let isvalid = false;
    for (let i = 0; i < array.length; i++) {
      let element: any = array[i];
      if (element.component == itemCode) {
        array.splice(i, 1);
        i = i - 1;
        isvalid = true;
      }
    }
    this.setFinalData = array;
    return isvalid;
  }

  // function for reset grid 

  resetGrid() {
    this.dataList = [];
    this.customer_code = "";
    this.customer_name = "";
    this.ship_to_address = "";
    this.bill_to_address = "";
    this.setFinalData = [];
    this.getFeatureList();
  }

  //This method will get Customer's all info.

  getCustomerAllInfo() {
    this.service.getCustomerAllInfo(this.companyName, this.customer_code).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                CommonData.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.router, 'Sessionout');
                return;
              }
            }
          }
          //Fill bill to
          if (data.BillToDef.length > 0) {

            let bill_data: any = [];

            bill_data.push({
              CompanyDBId: this.companyName,
              Customer: this.customer_code,
              BillTo: data.BillToDef[0].BillToDef,
              currentDate: "",
              GUID: sessionStorage.getItem("GUID"),
              UsernameForLic: sessionStorage.getItem("loggedInUser")
            });
            //To get bill address
            this.fillBillAddress(bill_data, data);

          }
          else {

          }
        } else {
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
        }
        this.showLookupLoader = false;
      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.CommonService.show_notification(this.language.server_error, 'error');
        }
        return;
      })

  }

  fillBillAddress(bill_data, orig_data) {
    this.service.fillBillAddress(bill_data).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null && data != undefined) {
          if (data.BillingAdress != undefined) {
            this.bill_to_address = data.BillingAdress[0].BillingAdress;
          }
        }
        else {
          this.bill_to_address = '';
        }

        let ship_data: any = [];

        ship_data.push({
          CompanyDBId: this.companyName,
          Customer: this.customer_code,
          ShipTo: orig_data.BillToDef[0].BillToDef,
          currentDate: "",
          BillTo: orig_data.BillToDef[0].BillToDef,
          GUID: sessionStorage.getItem("GUID"),
          UsernameForLic: sessionStorage.getItem("loggedInUser")
        });

        this.fillShipAddress(ship_data, orig_data);


      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
      })
  }

  fillShipAddress(ship_data, orig_data) {
    this.service.fillShipAddress(ship_data).subscribe(
      data => {
        this.showLookupLoader = false;

        if (data != null && data != undefined) {
          if (data.length > 0) {

            if (data != undefined && data != undefined) {
              if (data[0].ErrorMsg == "7001") {
                CommonData.made_changes = false;
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.router, 'Sessionout');
                return;
              }
            }
          }
          if (data.ShippingAdress != undefined) {
            this.ship_to_address = data.ShippingAdress[0].ShippingAdress;
          }
        }
        else {
          this.ship_to_address = '';
          this.showLookupLoader = false;
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }


  // function for get look up value

  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }

    if (this.lookupfor == 'output_customer') {
      this.customer_code = $event[0];
      this.customer_name = $event[1];
      this.lookupfor = "";
      this.getCustomerAllInfo();
    }

  }

  // function for Customer look up 


  openCustomerLookUp() {

    this.showLookupLoader = true;
    this.serviceData = [];
    this.service.getCustomerLookupData(this.companyName).subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }

          this.lookupfor = 'output_customer';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )

  }

  // function for Change quantity 
  onChangeQuantity(rowindex, value) {
    CommonData.made_changes = true;
    this.currentrowIndex = rowindex
    this.dataList[this.currentrowIndex].Quantity = value;
    this.dataList[this.currentrowIndex].TotalPrice = parseInt(this.dataList[this.currentrowIndex].Quantity) * parseInt(this.dataList[this.currentrowIndex].Price);
    this.checkExistSetFinalData(this.dataList[this.currentrowIndex].component);
    let dataItem = this.dataList[this.currentrowIndex];
      if(parseInt(value) > 0)
      {
        this.setFinalData.push(dataItem);
      }
    
  }

  // function for Change Price 
  onChangePrice(rowindex, value) {
    CommonData.made_changes = true;
    this.currentrowIndex = rowindex
    this.dataList[this.currentrowIndex].Price = value;
    this.dataList[this.currentrowIndex].TotalPrice = parseInt(this.dataList[this.currentrowIndex].Quantity) * parseInt(this.dataList[this.currentrowIndex].Price);
    let dataexist = this.checkExistSetFinalData(this.dataList[this.currentrowIndex].component);
    if (dataexist) {
      let dataItem = this.dataList[this.currentrowIndex];
      this.setFinalData.push(dataItem);
    }
  }

  // function for getPreview look up

  OpenPreviewlookUp() {
    if (this.setFinalData.length > 0) {
      this.showLookupLoader = true;
      this.serviceData = [];
      this.lookupfor = 'feature_details_lookup';
      this.showLookupLoader = false;
      this.serviceData = this.setFinalData;
    }
  }

  //function for Save Wizard 

  onSaveClick()
  {
    if(this.customer_code == "")
    {
      this.CommonService.show_notification(this.language.SelectCustomerCode, 'error');
      return false;
    }
  }


}
