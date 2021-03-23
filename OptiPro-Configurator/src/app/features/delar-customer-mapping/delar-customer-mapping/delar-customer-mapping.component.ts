import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DelarCustomerMappingService } from 'src/app/core/service/delarCustomerMapping.service';
import { filter } from 'minimatch';


@Component({
  selector: 'app-delar-customer-mapping',
  templateUrl: './delar-customer-mapping.component.html',
  styleUrls: ['./delar-customer-mapping.component.scss']
})
export class DelarCustomerMappingComponent implements OnInit {


  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/home';
  public lookupfor = "";
  public showLookupLoader = false;
  public serviceData = [];
  public currentrowIndex = 0;
  public currentPage = 1;
  public isColumnFilter: boolean = false;
  public selectedValue: number = 10;
  public skip: number = 0;
  public gridView: GridDataResult;
  record_per_page: any;
  current_page: any = 1;
  public filter: CompositeFilterDescriptor;
  public listItems: Array<string> = this.commonData.default_limits;
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public delarList = [];
  public isCustomerDisable = true;
  public isDelarCodeDisable = true;
  public isDelarNameDisable = true;
  public delarModelData = [];
  public delar_Code = "";
  public setFinalData = [];



  constructor(private router: Router, private service: DelarCustomerMappingService, private httpclient: HttpClient, private CommonService: CommonService) { }

  ngOnInit() {
    this.record_per_page = sessionStorage.getItem('defaultRecords');
    if (sessionStorage.getItem('defaultRecords') !== undefined && sessionStorage.getItem('defaultRecords') != "") {
      this.selectedValue = Number(sessionStorage.getItem('defaultRecords'));
    } else {
      this.selectedValue = Number(this.commonData.default_count);
    }
    if (sessionStorage.isFilterEnabled == "true") {
      this.isColumnFilter = true;
    } else {
      this.isColumnFilter = false;
    }
    this.getDelarList();
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
    let gridData = filterBy(this.delarList, filter);
    this.gridView =
      {
        data: gridData.slice(this.skip, this.skip + this.selectedValue),
        total: gridData.length
      }
  }

  // function for Delar Model Data 

  delaCustomerrModelData(datalist) {
    if (this.delarModelData.length > 0) {
      // let arr = this.changeBooleanToString(datalist);
      let arr = datalist;
      let data = this.delarModelData;
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].OPTM_DEALERCODE == this.delar_Code) {
          data.splice(i, 1);
        }
      }
      if (arr.length > 0) {
        arr.forEach(element => {
          let arr1 = [];
          if (element.OPTM_ID == null) {
            element.OPTM_ID = 0;
          }
          arr1.push(element);
          arr1[0]["OPTM_DEALERCODE"] = this.delar_Code;
          //arr1[0]["OPTM_ID"] = 0;
          data.push(arr1[0]);
        });
      }
      else {
        if (arr[0].OPTM_ID == null) {
          arr[0].OPTM_ID = 0;
        }
        arr[0]["OPTM_DEALERCODE"] = this.delar_Code;
        //  arr[0]["OPTM_ID"] = 0;
        data.push(arr[0]);
      }
      this.delarModelData = [];
      this.delarModelData = data;
    }
    else {
      //let arr = this.changeBooleanToString(datalist);
      let arr = datalist;
      if (arr.length > 0) {
        arr.forEach(element => {
          let arr1 = [];
          if (element.OPTM_ID == null) {
            element.OPTM_ID = 0;
          }
          arr1.push(element);
          arr1[0]["OPTM_DEALERCODE"] = this.delar_Code;
          //arr1[0]["OPTM_ID"] = 0;
          this.delarModelData.push(arr1[0]);
        });
      }
      else {
        if (arr[0].OPTM_ID == null) {
          arr[0].OPTM_ID = 0;
        }
        arr[0]["OPTM_DEALERCODE"] = this.delar_Code;
        // arr[0]["OPTM_ID"] = 0;
        this.delarModelData.push(arr[0]);
      }
    }
  }

  // function for Change String to Boolean

  changeStringTOBoolean(datalist) {
    datalist.forEach(element => {
      if (element.ISSELECTED == "Y") {
        element.ISSELECTED = true;
      }
      else {
        element.ISSELECTED = false;
      }
    });

    return datalist;
  }

  // function for Change Boolean to String 

  changeBooleanToString(datalist) {
    datalist.forEach(element => {
      if (element.ISSELECTED == true) {
        element.ISSELECTED = "Y";
      }
      else {
        element.ISSELECTED = "N";
      }
    });

    return datalist;
  }



  // function for load items  in grid .

  public loadItems(): void {
    this.gridView = {
      data: this.delarList.slice(this.skip, this.skip + this.selectedValue),
      total: this.delarList.length
    };
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

  // function for get Model List API 

  getModelList(delarCode: any, rowindex) {
    this.currentrowIndex = rowindex;
    this.delar_Code = delarCode;
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'delar_Customer_Mapping';
    this.service.getModelList(delarCode).subscribe(
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
          let dataList = [];
          // this.serviceData = this.changeStringTOBoolean(data);
          if (this.delarModelData.length > 0) {
            dataList = this.delarModelData.filter(function (obj) {
              return obj.OPTM_DEALERCODE == delarCode;
            })
          }
          if (dataList.length > 0) {
            dataList.forEach(element => {
              data.forEach(elementList => {
                if (element.OPTM_MODELID == elementList.OPTM_MODELID) {
                  elementList.ISSELECTED = true;
                  return;
                }
              });
            });
            this.serviceData = data;
          }
          else {
            this.serviceData = data;
          }

          console.log(this.serviceData);
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


  // function for get customer template list Api .

  getDelarList() {
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.delarList = []
    this.service.getDelarList().subscribe(
      data => {
        this.showLookupLoader = false;
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
            this.delarList.push({
              OPTM_DEALERCODE: data[i].OPTM_DEALERCODE,
              OPTM_DEALERNAME: data[i].OPTM_DEALERNAME,
              OPTM_USERTYPE: data[i].OPTM_USERTYPE,
              OPTM_CUSTCODE: data[i].OPTM_CUSTCODE,
              OPTM_CUSTNAME: data[i].OPTM_CUSTNAME,
              OPTM_PRICELISTCODE: data[i].OPTM_PRICELISTCODE,
              OPTM_REPORTNAME: data[i].OPTM_REPORTNAME,
              OPTM_PRICELISTNAME: data[i].OPTM_PRICELISTNAME,
              OPTM_ID: 0,
              rowindex: i,
            });
          }
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

  // function for ON Reoport Column Changes 

  on_report_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowIndex = rowindex
    this.delarList[this.currentrowIndex].OPTM_REPORTNAME = value;
    this.setFinalDelarMappingData();
  }


  // function for get customer template list Api .

  getCustomerList(rowindex: any) {
    this.currentrowIndex = rowindex;
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'delar_Customer_List';
    this.service.getCustomerList().subscribe(
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
          console.log(this.serviceData);
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

  // function for get customer template list Api .

  getPriceList(rowindex: any) {
    this.currentrowIndex = rowindex;
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'delar_Price_List';
    this.service.getPriceList().subscribe(
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
          console.log(this.serviceData);
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



  // function for geeting default template output from look up component

  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    CommonData.made_changes = true;
    if (this.lookupfor == "delar_Customer_Mapping") {
      let data = $event;
      let ModelList = [];
      data.forEach(element => {
        if (element.ISSELECTED == true) {
          ModelList.push(element);
        }
      });
      this.delaCustomerrModelData(ModelList);
      this.setFinalDelarMappingData();
    }
    else if (this.lookupfor == "delar_Price_List") {
      this.delarList[this.currentrowIndex].OPTM_PRICELISTNAME = $event[1];
      this.delarList[this.currentrowIndex].OPTM_PRICELISTCODE = $event[0];
      this.setFinalDelarMappingData();
    }
    else if (this.lookupfor == "delar_Customer_List") {
      this.delarList[this.currentrowIndex].OPTM_CUSTCODE = $event[0];
      this.delarList[this.currentrowIndex].OPTM_CUSTNAME = $event[1];
      this.delarList[this.currentrowIndex].OPTM_PRICELISTNAME = $event[3];
      this.delarList[this.currentrowIndex].OPTM_PRICELISTCODE = $event[2];
      this.setFinalDelarMappingData();
    }
  }

  // function for set final data for Delar Mapping

  setFinalDelarMappingData() {
    let indexNumber = this.currentrowIndex;
    if (this.setFinalData.length > 0) {
      let data = this.setFinalData;
      data.forEach((element, index) => {
        if (indexNumber == element.rowindex) {
          data.splice(index, 1);
          return;
        }
      });
      this.setFinalData = data;
      this.setFinalData.push(this.delarList[this.currentrowIndex]);
    }
    else {
      this.setFinalData.push(this.delarList[this.currentrowIndex]);
    }

  }

  // function for Save data delar 
  onSaveClick() {
    this.showLookupLoader = true;
    let finalData: any = {};
    finalData.OPCONFIG_DEALER_CUST_MAP = this.setFinalData;
    finalData.OPCONFIG_USERLIST = [];
    finalData.OPCONFIG_DEALER_CUST_MODELMAP = this.delarModelData;
    this.service.SaveDelarDetailsList(finalData).subscribe(data => {
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
}







