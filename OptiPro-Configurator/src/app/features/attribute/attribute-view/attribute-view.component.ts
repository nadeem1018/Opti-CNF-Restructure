import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/core/service/common.service';
import { Router } from '@angular/router';
import { CommonData, ColumnSetting } from 'src/app/core/data/CommonData';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ModelbomService } from 'src/app/core/service/modelbom.service';
import { AttributeService } from 'src/app/core/service/attribute.service';

@Component({
  selector: 'app-attribute-view',
  templateUrl: './attribute-view.component.html',
  styleUrls: ['./attribute-view.component.scss']
})
export class AttributeViewComponent implements OnInit {

  serviceData: any;
  public lookupfor = '';
  public selectedImage = "";

  @ViewChild("searchinput", { static: true }) _el: ElementRef;
  public commonData = new CommonData();
  public listItems: Array<string> = this.commonData.default_limits;
  public selectedValue: number = 10;
  public skip: number = 0;

  public companyName: string = "";
  public username: string = "";
  add_route_link = '/attribute/add';
  record_per_page_list: any = [10, 25, 50, 100]
  record_per_page: any;
  search_string: any = "";
  current_page: any = 1;
  page_numbers: any = "";
  rows: any = "";
  public ViewData: any = [];
  show_table_footer: boolean = false;
  dataArray: any = [];
  public showLoader: boolean = true;
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public dialog_box_value: any;
  public row_id: any;
  public attributeCode: any;
  public attributeSeq: any;
  public CheckedData: any = [];
  public selectall: boolean = false;
  public GetItemData: any = [];
  public isMultiDelete: boolean = false;
  public isColumnFilter: boolean = false;
  public showImportButton: boolean = false;
  public menu_auth_index = '203';
  public showLookupLoader: boolean = false;
  //table_head_foot = ['Select','#', 'Model Id', 'Name', 'Action'];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  page_main_title = this.language.attribute_master;
  table_title = this.page_main_title;
  table_head_foot = [this.language.select, this.language.hash, this.language.ModelId, this.language.model_ModelCode, this.language.Name, this.language.description, this.language.action];
  public table_hidden_elements = [false, true, true, false, false, false, false];
  constructor(private router: Router, private service: AttributeService, private commonservice: CommonService) { }

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;

  public allowUnsort = true;
  public sort: SortDescriptor[];
  public gridView: GridDataResult;

  public columns: ColumnSetting[] = [
    {
      field: 'OPTM_ATTR_CODE',
      title: this.language.Attribute_code,
      type: 'text',
      width: '200',
      attrType: 'link'
    },
    {
      field: 'OPTM_ATTR_NAME',
      title: this.language.Attribute_name,
      type: 'text',
      width: '200',
      attrType: 'text'
    }
    // {
    //   field: 'OPTM_FEATUREDESC',
    //   title: this.language.description,
    //   type: 'text',
    //   width: '100',
    //   attrType: 'text'
    // },
  ];

  getcurrentPageSize(grid_value) {
    sessionStorage.setItem('defaultRecords', grid_value);
    console.log('=sessionStorage=======', sessionStorage.defaultRecords);
    this.skip = 0;
    this.selectedValue = grid_value;
    this.record_per_page = sessionStorage.getItem('defaultRecords');
  }

  getLookupValue($event) {

  }

  dataStateChanged(event) {
    // console.log(event);
    event.filter = [];
    this.record_per_page = sessionStorage.getItem('defaultRecords');
    this.selectedValue = event.take;
    this.skip = event.skip;
  }

  on_selection(grid_event) {
    grid_event.selectedRows = [];
  }
  saveFilterState() {
    sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
  }
  ngOnInit() {
    this.showLoader = true;
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
            this.commonservice.show_notification(objcc.language.notAuthorisedScreen, 'error');
            objcc.router.navigateByUrl('home');
          }, 200);
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.commonservice.isUnauthorized();
        }
        return;
      });
    // check screen authorisation - end

    this.service_call(this.current_page, this.search_string);
  }
  ngAfterViewInit() {
    // this._el.nativeElement.focus();
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

  service_call(page_number, search) {
    if (this.record_per_page !== undefined && sessionStorage.getItem('defaultRecords')) {
      if (this.record_per_page !== sessionStorage.getItem('defaultRecords')) {
        sessionStorage.setItem('defaultRecords', this.record_per_page);
      }
    } else {
      this.record_per_page = this.commonData.default_count;
      sessionStorage.setItem('defaultRecords', this.record_per_page);
    }
    var dataset = this.service.GetAttributeList (search, page_number, this.record_per_page).subscribe(
      data => {

        console.log(data);
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLoggedInUser().subscribe();
              this.commonservice.signOut(this.router, 'Sessionout');
              return;
            }
          }
        }

        this.dataArray = data;
        this.loadServerData(this.dataArray);
        this.CheckedData = [];
        this.selectall = false;
        this.commonData.clearChildCheckbox();
      }, error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
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
    if (this.sort !== undefined && this.sort !== null) {
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
    this.service.setAttributeData(data);
    this.router.navigateByUrl('attribute/edit/' + data.OPTM_SEQ);
  }
  button_click2(data) {
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    this.attributeCode = data.OPTM_ATTR_CODE;
    this.attributeSeq = data.OPTM_SEQ;
  }

  duplicate_record(data) {
    this.router.navigateByUrl('attribute/add/' + data.OPTM_MODELID);
  }

  show_association(data) {
    console.log("data ", data);
    return false;
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
    this.GetItemData = []
    this.GetItemData.push({
      CompanyDBId: this.companyName,
      OPTM_SEQ: this.attributeSeq,
      OPTM_ATTR_CODE: this.attributeCode,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.service.DeleteData(this.GetItemData).subscribe(
      data => {
        this.CheckedData = [];
        this.isMultiDelete = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLoggedInUser().subscribe();
            this.commonservice.signOut(this.router, 'Sessionout');
            return;
          }
        }

        
        if (data[0].IsDeleted == "0" && data[0].Message.includes("Reference Already Exist")) {
          this.commonservice.show_notification(data[0].Message, 'error');
          this.CheckedData = [];
          this.selectall = false;
          this.commonData.clearChildCheckbox();
        }
        else if (data[0].IsDeleted == "1") {
          this.commonservice.show_notification(this.language.DataDeleteSuccesfully , 'success');
          this.service_call(this.current_page, this.search_string);
          this.router.navigateByUrl('attribute/view');
          this.CheckedData = [];
          this.selectall = false;
          this.commonData.clearChildCheckbox();
        }
        else {
          this.commonservice.show_notification(this.language.DataNotDelete , 'error');
        }
        this.CheckedData = [];
        this.selectall = false;
        this.commonData.clearChildCheckbox();
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.commonservice.isUnauthorized();
        }
        return;
      });
  }

  on_checkbox_checked(checkedvalue, row_data) {
    var isExist = 0;
    if (this.CheckedData.length > 0) {
      for (let i = 0; i < this.CheckedData.length; i++) {
        if (this.CheckedData[i].OPTM_ATTR_CODE == row_data.OPTM_ATTR_CODE) {
          isExist = 1;
          if (checkedvalue == true) {
            this.CheckedData.push({
              OPTM_SEQ: row_data.OPTM_SEQ,
              OPTM_ATTR_CODE: row_data.OPTM_ATTR_CODE,
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
          OPTM_SEQ: row_data.OPTM_SEQ,
          OPTM_ATTR_CODE: row_data.OPTM_ATTR_CODE,
          CompanyDBId: this.companyName,
          GUID: sessionStorage.getItem("GUID"),
          UsernameForLic: sessionStorage.getItem("loggedInUser")
        })
      }
    }
    else {
      this.CheckedData.push({
        OPTM_SEQ: row_data.OPTM_SEQ,
        OPTM_ATTR_CODE: row_data.OPTM_ATTR_CODE,
        CompanyDBId: this.companyName,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      })
    }

    if (this.dataArray.length == this.CheckedData.length) {
      this.commonData.checkedparentCheckbox();
      }else{
       this.commonData.clearparentCheckbox();
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
          this.commonData.checkedChildCheckbox();
          this.CheckedData.push({
            OPTM_SEQ: this.dataArray[i].OPTM_SEQ,
            OPTM_ATTR_CODE: this.dataArray[i].OPTM_ATTR_CODE,
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
      this.commonservice.show_notification(this.language.Norowselected, 'error');
    }
  }

  delete_multi_row() {

    if (this.CheckedData.length > 0) {
      this.showLoader = true
      this.service.DeleteData(this.CheckedData).subscribe(
        data => {
          this.showLoader = false
          this.CheckedData = [];
          this.isMultiDelete = false;
          if (data != undefined && data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLoggedInUser().subscribe();
              this.commonservice.signOut(this.router, 'Sessionout');
              return;
            }
          }

          for (var i = 0; i < data.length; i++) {
            if (data[i].IsDeleted == "0" && data[i].Message.includes("Reference Already Exist")) {
              this.commonservice.show_notification(data[i].Message, 'error');
            }
            else if (data[i].IsDeleted == "1") {
              this.commonservice.show_notification(this.language.DataDeleteSuccesfully + ' with Attribute Code : ' + data[i].AttributeCode, 'success');
              this.CheckedData = [];
              this.service_call(this.current_page, this.search_string);
              this.router.navigateByUrl('attribute/view');
            }
            else {
              this.commonservice.show_notification(this.language.DataNotDelete + ' : ' + data[i].ModelCode, 'error');
            }
          }

          this.CheckedData = [];
          this.selectall = false;
          this.commonData.clearChildCheckbox();
        }, error => {
          this.showLoader = false
          if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
            this.commonservice.isUnauthorized();
          }
          return;
        })
    } else {
      this.commonservice.show_notification(this.language.Norowselected, 'error');
    }

  }

}
