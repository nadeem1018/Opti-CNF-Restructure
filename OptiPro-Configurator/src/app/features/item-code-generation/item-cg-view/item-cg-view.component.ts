import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ColumnSetting, CommonData } from 'src/app/core/data/CommonData';
import { CommonService } from 'src/app/core/service/common.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ItemcodegenerationService } from 'src/app/core/service/itemcodegeneration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-cg-view',
  templateUrl: './item-cg-view.component.html',
  styleUrls: ['./item-cg-view.component.scss']
})
export class ItemCgViewComponent implements OnInit {

  serviceData: any;
  public lookupfor = '';
  public selectedImage = "";
  @ViewChild("searchinput", {static :true}) _el: ElementRef;
  public commonData = new CommonData();


  public companyName: string = "";
  public username: string = "";
  add_route_link = '/item-code-generation/add';
  record_per_page_list: any = [10, 25, 50, 100];



  public listItems: Array<string> = this.commonData.default_limits;
  public selectedValue: number = 10;
  public skip:number = 0;

  record_per_page: any;
  search_string: any = "";
  current_page: any = 1;
  page_numbers: any = "";
  public isColumnFilter: boolean = false;
  // rows: any = "";
  public ViewData: any = [];
  public toDelete: any = {
  };
  public showLoader: boolean = true;
  show_table_footer: boolean = false;
  public CheckedData: any = [];

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public dialog_box_value: any;
  public row_id: any;
  public selectall: boolean = false;
  public GetItemData: any = [];
  public isMultiDelete: boolean = false;
  public showImportButton: boolean = false;
  public menu_auth_index = '200';
  public dataArray: any[];
  public showLookupLoader: boolean = false;
  public allowUnsort = true;
  public sort: SortDescriptor[];
  public gridView: GridDataResult;

  //table_head_foot = ['checkbox_here', '#', 'Code', 'Final String', 'Action'];
  public language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title;
  public table_title;
  table_head_foot = [this.language.checkbox_here, this.language.hash, this.language.code, this.language.finalstring, this.language.action];
  public table_hidden_elements = [false, true, false, false, false];

  constructor(private router: Router, private itemgen: ItemcodegenerationService, private commonservice: CommonService) { }

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;


  public columns: ColumnSetting[] = [
  {
    field: 'Code',
    title: this.language.code,
    type: 'text',
    width: '500',
    attrType: 'link'
  }, {
    field: 'FinalString',
    title: this.language.finalstring,
    type: 'text',
    width: '500',
    attrType: 'text'
  },
  ];

  getcurrentPageSize(grid_value) {
    sessionStorage.setItem('defaultRecords', grid_value);
    this.skip = 0;
    this.selectedValue = grid_value;
    this.record_per_page = sessionStorage.getItem('defaultRecords');
  }
  saveFilterState() {
    sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
  }
  ngOnInit() {
    this.showLoader = true;
    this.page_main_title = 
    this.commonData.checkSession();
    this.companyName = sessionStorage.getItem('selectedComp');
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
    this.page_main_title = this.language.itemcodegeneration;
    this.table_title = this.page_main_title

    // check screen authorisation - start
    this.commonservice.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          let objcc = this;
          setTimeout(function () {
            objcc.commonservice.show_notification( objcc.language.notAuthorisedScreen, 'error');
            objcc.router.navigateByUrl('home');
          }, 200);
        }
      },
      error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonservice.isUnauthorized();
        }
        return;
      });
    this.service_call(this.current_page, this.search_string);
  }
  public clearChildCheckbox(){
    let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
    if(child_checkbox_selector.length > 0){
      for(let i = 0; i < child_checkbox_selector.length; i++){
        child_checkbox_selector[i].checked = false;
      }
    }
  }

  dataStateChanged(event){
    event.filter = [];
    this.record_per_page = sessionStorage.getItem('defaultRecords');
    this.selectedValue = event.take;
    this.skip = event.skip;
  }

  on_selection(grid_event) {
    grid_event.selectedRows = [];
  }

  on_page_limit_change() {
    this.current_page = 1;
    this.service_call(this.current_page, this.search_string);
  }


  getPageValue() {
    if (this.selectedValue == null) {
      this.selectedValue = 10;
    }
    return this.selectedValue;
  }

  search_results() {
    this.current_page = 1;
    this.service_call(this.current_page, this.search_string);
  }

  log(data) {
    console.log(data);
  }

  service_call(page_number, search) {
    if (this.record_per_page !== undefined && sessionStorage.getItem('defaultRecords')) {
      if (this.record_per_page !== sessionStorage.getItem('defaultRecords')) {
        sessionStorage.setItem('defaultRecords', this.record_per_page);
      }
    } else {
      this.record_per_page = this.commonData.default_count;
      sessionStorage.setItem('defaultRecords', this.record_per_page);
    }
    var dataset = this.itemgen.viewItemGenerationData(this.companyName, search, page_number, this.record_per_page).subscribe(
      data => {

        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLoggedInUser().subscribe();
            this.commonservice.signOut(this.router, 'Sessionout');
            return;
          }
        }
        data.reverse();
        this.dataArray = data;
        console.log("sort - " , this.sort);
        console.log("this.dataArray ", this.dataArray);
        this.loadServerData(this.dataArray);

        this.CheckedData = [];
        this.selectall = false;
        this.clearChildCheckbox();
      },error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonservice.isUnauthorized();
        }
        return;
      });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadServerData(this.dataArray);
  }

  private loadServerData(dataset): void {
    if(this.sort !== undefined && this.sort !== null){
      this.gridView = {
        data: orderBy(dataset, this.sort),
        total: this.dataArray.length
      };
    } else {
      this.gridView = {
        data: dataset,
        total: this.dataArray.length
      }; 
    }
  }

  button_click1(data) {

    this.router.navigateByUrl('item-code-generation/edit/' + data.Code.trim());
    // button click function in here
  }
  button_click2(data) {
    this.isMultiDelete = false;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    this.row_id = data.Code;
    // var result = confirm(this.language.DeleteConfimation);
  }

  show_association(data){
    console.log("data " , data);
    return false;
  }

  duplicate_record(data,isDuplicate){
    this.router.navigateByUrl('item-code-generation/add-wdit/' + data.Code.trim());
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      if (this.isMultiDelete == false) {
        this.delete_row();
      }
      else {
        this.delete_multi_row();
      }
    }
    this.show_dialog = false;
  }

  //delete values
  delete_row() {
    // console.log("YES DELETE--"+this.row_id);
    this.GetItemData = []
    this.GetItemData.push({
      CompanyDBId: this.companyName,
      ItemCode: this.row_id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    })

    this.itemgen.DeleteData(this.GetItemData).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLoggedInUser().subscribe();
            this.commonservice.signOut(this.router, 'Sessionout');
            return;
          }
        }

        if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
          this.commonservice.show_notification( this.language.Refrence + ' at: ' + data[0].ItemCode, 'error');
          this.CheckedData = [];
          this.selectall = false;
        }
        else if (data[0].IsDeleted == "1") {
          this.commonservice.show_notification( this.language.DataDeleteSuccesfully, 'success');
          this.showLoader = true;
          this.service_call(this.current_page, this.search_string);
          this.router.navigateByUrl('item-code-generation/view');
          this.CheckedData = [];
          this.selectall = false;
        }
        else {
          this.commonservice.show_notification( this.language.DataNotDelete + ' : ', 'error');
        }

        this.CheckedData = [];
        this.selectall = false;
        this.clearChildCheckbox();
      },error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonservice.isUnauthorized();
        }
        return;
      });

  }

  on_checkbox_checked(checkedvalue, row_data) {
    var isExist = 0;
    if (this.CheckedData.length > 0) {
      for (let i = this.CheckedData.length - 1; i >= 0; --i) {
        if (this.CheckedData[i].ItemCode == row_data.Code) {
          isExist = 1;
          if (checkedvalue == true) {
            this.CheckedData.push({
              ItemCode: row_data.Code,
              CompanyDBId: this.companyName,
              GUID: sessionStorage.getItem("GUID"),
              UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
          }
          else {
            this.CheckedData.splice(i, 1)
          }
        }
      }
      if (isExist == 0) {
        this.CheckedData.push({
          ItemCode: row_data.Code,
          CompanyDBId: this.companyName,
          GUID: sessionStorage.getItem("GUID"),
          UsernameForLic: sessionStorage.getItem("loggedInUser")
        })
      }
    }
    else {
      this.CheckedData.push({
        ItemCode: row_data.Code,
        CompanyDBId: this.companyName,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      })
    }


  }

  on_Selectall_checkbox_checked(checkedvalue) {
    var isExist = 0;
    this.CheckedData = []
    this.selectall = false
    if (checkedvalue == true) {
      if (this.dataArray.length > 0) {
        this.selectall = true
        for (let i = 0; i < this.dataArray.length; ++i) {

          this.CheckedData.push({
            ItemCode: this.dataArray[i].Code,
            CompanyDBId: this.companyName,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
          })
        }
      }
    }
    else {
      this.selectall = false
    }
  }

  delete() {
    if (this.CheckedData.length > 0) {
      this.isMultiDelete = true;
      this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
      this.show_dialog = true;
    }
    else {
      this.commonservice.show_notification( this.language.Norowselected, 'error');
    }

  }

  delete_multi_row() {
    this.showLoader = true
    this.itemgen.DeleteSelectedData(this.CheckedData).subscribe(
      data => {

        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLoggedInUser().subscribe();
            this.commonservice.signOut(this.router, 'Sessionout');
            return;
          }
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists") {
            this.commonservice.show_notification( this.language.Refrence + ' at: ' + data[i].ItemCode, 'error');
            this.CheckedData = [];
            this.selectall = false;
          }
          else if (data[i].IsDeleted == "1") {
            this.commonservice.show_notification(this.language.DataDeleteSuccesfully + ' with Item Id : ' + data[i].ItemCode, 'success');
            this.CheckedData = [];
            this.selectall = false;
            this.showLoader = true;
            this.service_call(this.current_page, this.search_string);
            this.router.navigateByUrl('item-code-generation/view');
          }
          else {
            this.commonservice.show_notification( this.language.DataNotDelete + ' : ' + data[i].ItemCode, 'error');
          }
          this.showLoader = false
        }
        this.CheckedData = [];
        this.selectall = false;
        this.clearChildCheckbox();
      },error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commonservice.isUnauthorized();
        }
        return;
      })

  }


}
