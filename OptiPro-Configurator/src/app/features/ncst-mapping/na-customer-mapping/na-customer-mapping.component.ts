import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { CustomerTemplateMappingService } from 'src/app/core/service/custmermapping.service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';





@Component({
  selector: 'app-na-customer-mapping',
  templateUrl: './na-customer-mapping.component.html',
  styleUrls: ['./na-customer-mapping.component.scss']
})
export class NeedsAssesmentCustomerMappingComponent implements OnInit {

  //varibales define of NeedsAssesmentCustomerMappingComponent class

  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/home';
  public lookupfor: string = '';
  public selectedImage = "";
  public showLookupLoader = false;
  public serviceData = [];
  public currentrowIndex = 0;
  public customerDisable = true;
  public currentPage = 1;
  public cusomerChangeTemplateMapping = [];
  public need_customer_table = [];
  public isColumnFilter: boolean = false;
  public selectedValue: number = 10;
  public skip: number = 0;
  private data: Object[];
  public gridView: GridDataResult;
  record_per_page: any;
  current_page: any = 1;
  public filter: CompositeFilterDescriptor;
  public listItems: Array<string> = this.commonData.default_limits;
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public defaultYesNO: any;


  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: CustomerTemplateMappingService) { }

  // hook cycle of componnent ,, 

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
    this.getCustomerTemplateList();

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
    let gridData = filterBy(this.need_customer_table, filter);
    this.gridView =
      {
        data: gridData.slice(this.skip, this.skip + this.selectedValue),
        total: gridData.length
      }
  }


  // function for load items  in grid .

  public loadItems(): void {
    this.gridView = {
      data: this.need_customer_table.slice(this.skip, this.skip + this.selectedValue),
      total: this.need_customer_table.length
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



  // function for getting customer template list 

  getCustomerTemplateList() {

    this.showLookupLoader = true;
    CommonData.made_changes = true;
    this.need_customer_table = []
    this.service.getCustomerTemplateMappingList().subscribe(
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
            this.need_customer_table.push({
              customer_name: data[i].CUSTOMER_NAME,
              template_ID: data[i].OPTM_TEMPLATEID,
              rowindex: i,
              CustID: data[i].CustID,
              OPTM_ID: data[i].OPTM_ID,
              customer_code :data[i].CustID

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


  // function for get customer template list Api .

  getListDefaultNeedAssementTemplate(rowindex: any) {
    this.currentrowIndex = rowindex;
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    console.log('configure_need_assesment');
    this.serviceData = []
    this.lookupfor = 'configure_need_assesment';
    this.service.getNeedAssesmentTemplateList().subscribe(
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
    this.need_customer_table[this.currentrowIndex].template_ID = $event[1];
    this.cusomerChangeTemplateMapping.push({
      // CUSTOMER_NAME: this.need_customer_table[this.currentrowIndex].customer_name
      OPTM_ID: this.need_customer_table[this.currentrowIndex].OPTM_ID,
      CustID: this.need_customer_table[this.currentrowIndex].CustID,
      OPTM_TEMPLATEID: $event[1]

    });
  }


  // function for check proper Default template 

  onCheckDefaultTemplate(TemplateID, rowIndex) {
    CommonData.made_changes = true;
    this.service.onDefaultTemplateCheck(TemplateID).subscribe(
      data => {
        if (data === "False") {

          this.CommonService.show_notification(this.language.InvalidDefaultTemplate, 'error');
          this.need_customer_table[rowIndex].template_ID = "";
          return;
        }
        else {
          this.need_customer_table[rowIndex].template_ID = TemplateID;
          this.cusomerChangeTemplateMapping.push({
            // CUSTOMER_NAME: this.need_customer_table[this.currentrowIndex].customer_name,
            OPTM_ID: this.need_customer_table[rowIndex].OPTM_ID,
            CustID: this.need_customer_table[rowIndex].CustID,
            OPTM_TEMPLATEID: TemplateID

          });
          return;
        }
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  saveConfirmation() {
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.SaveConfirmation });
    this.show_dialog = true;   
  }

  get_dialog_value(userSelectionValue) { 
   
    if (userSelectionValue == true) {
      this.defaultYesNO = "Y";
      this.onSaveClick(this.defaultYesNO)
     }else{
      this.defaultYesNO = "N";
     }
    this.show_dialog = false;
   
  }
  // function for Update data 

  onSaveClick(defaultValue) {
    console.log(this.need_customer_table);    
    this.cusomerChangeTemplateMapping.filter(function (obj) {
      obj['DefaultYesNO'] = defaultValue
      return obj;
    });
    this.showLookupLoader = true;
    this.service.SaveCustomerTemplate(this.cusomerChangeTemplateMapping).subscribe(data => {
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
        this.cusomerChangeTemplateMapping = [];
        this.getCustomerTemplateList();
        return;
      }else if(data === "Rule is not Exist for this template"){
        this.saveConfirmation();
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
