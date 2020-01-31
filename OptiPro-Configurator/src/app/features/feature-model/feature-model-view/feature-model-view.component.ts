import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnSetting, CommonData } from 'src/app/core/data/CommonData';
import { FeaturemodelService } from 'src/app/core/service/featuremodel.service';
import { Router } from '@angular/router';
import { FeaturebomService } from 'src/app/core/service/featurebom.service';
import { CommonService } from 'src/app/core/service/common.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-feature-model-view',
    templateUrl: './feature-model-view.component.html',
    styleUrls: ['./feature-model-view.component.scss']
})
export class FeatureModelViewComponent implements OnInit {
    public pageSize = 10;
    serviceData: any;
    @ViewChild("searchinput", { static: true }) _el: ElementRef;
    common_params = new CommonData();
    public commonData = new CommonData();

    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = 10;
    public skip: number = 0;

    public isColumnFilter: boolean = false;
    table_pages: any;
    dataArray: any = [];
    search_key: any;
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    table_head_foot = [this.language.select, this.language.hash, this.language.Id, this.language.code, this.language.Bom_Displayname, this.language.Model_Date, this.language.Type, this.language.Model_Status, this.language.action];
    public showLoader: boolean = true;
    public showLookupLoader: boolean = false;
    public columns: ColumnSetting[] = [
        {
            field: 'OPTM_FEATURECODE',
            title: this.language.code,
            type: 'text',
            width: '200',
            attrType: 'link'
        },
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Bom_Displayname,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
        {
            field: 'OPTM_EFFECTIVEDATE',
            title: this.language.Model_Date,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_TYPE',
            title: this.language.Type,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_STATUS',
            title: this.language.Model_Status,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
    ];

    public table_hidden_elements = [false, true, true, false, false, false, false, false, false];
    record_per_page_list: any = this.common_params.default_limits;
    add_route_link = '/feature/add';
    page_main_title = this.language.model_feature_master;
    table_title = this.page_main_title;

    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = [];
    rows: any = "";
    public dataBind: any = "";
    CompanyDBId: string;

    constructor(private fms: FeaturemodelService, private router: Router, private fbs: FeaturebomService, private commonservice: CommonService) { }
    show_table_footer: boolean = false;
    public lookupfor = '';
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public CheckedData: any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall: boolean = false;
    public isMultiDelete: boolean = false;
    public showImportButton: boolean = true;
    public menu_auth_index = '201';

    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;

    public allowUnsort = true;
    public sort: SortDescriptor[];
    public gridView: GridDataResult;

    getLookupValue($event) {

    }

    getPageValue() {
        if (this.selectedValue == null) {
            this.selectedValue = 10;
        }
        return this.selectedValue;
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
        this.commonData.checkSession();
        this.CompanyDBId = sessionStorage.getItem('selectedComp');
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
        this.showLoader = true;
    }

    public clearChildCheckbox() {
        let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if (child_checkbox_selector.length > 0) {
            for (let i = 0; i < child_checkbox_selector.length; i++) {
                child_checkbox_selector[i].checked = false;
            }
        }
    }
    getcurrentPageSize(grid_value) {
        sessionStorage.setItem('defaultRecords', grid_value);
        this.skip = 0;
        this.selectedValue = grid_value;
        this.record_per_page = sessionStorage.getItem('defaultRecords');
    }
    ngAfterViewInit() {
        //  this._el.nativeElement.focus();
    }
    on_page_limit_change() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
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
        var dataset = this.fms.getAllViewData(this.CompanyDBId, search, page_number, this.record_per_page).subscribe(
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
                this.CheckedData = [];
                this.selectall = false

            }, error => {
                this.showLookupLoader = false;
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
        this.router.navigateByUrl('feature/edit/' + data.OPTM_FEATUREID);
    }

    duplicate_record(data) {
        this.router.navigateByUrl('feature/add-edit/' + data.OPTM_FEATUREID);
    }

    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_FEATUREID;
    }

    show_association(row_data) {
        console.log("data ", row_data);
        this.showLookupLoader = true;
        this.fbs.ViewAssosciatedBOM(row_data.OPTM_FEATUREID).subscribe(
            data => {
                if (data != null && data != undefined) {
                    if (data.length > 0) {
                        if (data[0].ErrorMsg == "7001") {
                            this.commonservice.RemoveLoggedInUser().subscribe();
                            this.commonservice.signOut(this.router, 'Sessionout');
                            this.showLookupLoader = false;
                            return;
                        }

                        this.serviceData = data;
                        this.lookupfor = 'associated_BOM';
                        this.showLookupLoader = false;
                    }
                    else {
                        this.commonservice.show_notification(this.language.no_assocaited_bom_with_feature + " : " + row_data.OPTM_FEATURECODE, 'error');
                        this.showLookupLoader = false;
                        return;
                    }
                }
                else {
                    this.commonservice.show_notification(this.language.no_assocaited_bom_with_feature + " : " + row_data.OPTM_FEATURECODE, 'error');
                    this.showLookupLoader = false;
                    return;
                }
            },
            error => {
                this.commonservice.show_notification(this.language.server_error, 'error');
                this.showLookupLoader = false;
                return;
            }
        )

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
            CompanyDBId: this.CompanyDBId,
            FEATUREID: this.row_id,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
        });
        this.fms.DeleteData(this.GetItemData).subscribe(
            data => {
                this.CheckedData = [];
                this.selectall = false
                this.isMultiDelete = false;
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.router, 'Sessionout');
                        return;
                    }
                }

                if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
                    this.commonservice.show_notification(this.language.Refrence + ' at: ' + data[0].FeatureCode, 'error');
                    this.CheckedData = [];
                    this.selectall = false
                }
                else if (data[0].IsDeleted == "1") {
                    this.commonservice.show_notification(this.language.DataDeleteSuccesfully + ' with Id : ' + data[0].FeatureCode, 'error');
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('feature/view');
                }
                else {
                    this.commonservice.show_notification(this.language.DataNotDelete + ' : ' + data[0].FeatureCode, 'error');
                }

                this.CheckedData = [];
                this.selectall = false;
                this.clearChildCheckbox();
            }, error => {
                this.showLookupLoader = false;
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                    this.commonservice.isUnauthorized();
                }
                return;
            }
        )
    }

    // for testing purpose 
    dummy_data() {
        let dd: any = {
            total_records: "50",
            data: [
                ["1", "Demo", "Desc", "2011/04/25"]
            ]

        };
        console.log(dd);
    }

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].FEATUREID == row_data.OPTM_FEATUREID) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            FEATUREID: row_data.OPTM_FEATUREID,
                            CompanyDBId: this.CompanyDBId,
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
                    FEATUREID: row_data.OPTM_FEATUREID,
                    CompanyDBId: this.CompanyDBId,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }
        }
        else {
            this.CheckedData.push({
                FEATUREID: row_data.OPTM_FEATUREID,
                CompanyDBId: this.CompanyDBId,
                GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
        }
    }

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = [];
        this.selectall = false

        if (checkedvalue == true) {
            this.selectall = true
            if (this.dataArray.length > 0) {
                for (let i = 0; i < this.dataArray.length; ++i) {

                    this.CheckedData.push({
                        FEATUREID: this.dataArray[i].OPTM_FEATUREID,
                        CompanyDBId: this.CompanyDBId,
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
        this.showLoader = true
        this.fms.DeleteData(this.CheckedData).subscribe(
            data => {
                this.showLoader = false;
                this.CheckedData = [];
                this.selectall = false
                this.isMultiDelete = false;
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.router, 'Sessionout');
                        return;
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists") {
                        this.commonservice.show_notification(this.language.Refrence + ' at: ' + data[i].FeatureCode, 'error');
                        this.CheckedData = [];
                        this.selectall = false
                    }
                    else if (data[i].IsDeleted == "1") {
                        this.commonservice.show_notification(this.language.DataDeleteSuccesfully + ' with Id : ' + data[i].FeatureCode, 'error');
                        this.CheckedData = [];
                        this.selectall = false
                        this.service_call(this.current_page, this.search_string);
                        this.router.navigateByUrl('feature/view');
                    }
                    else {
                        this.commonservice.show_notification(this.language.DataNotDelete + ' : ' + data[i].FeatureCode, 'error');
                    }
                }

                this.CheckedData = [];
                this.selectall = false;
                this.clearChildCheckbox();
            }, error => {
                this.showLookupLoader = false;
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                    this.commonservice.isUnauthorized();
                }
                return;
            });

    }


    openImportPopup() {
        this.lookupfor = 'import_popup';
    }
    public sliderChange(pageIndex: number): void {
        this.skip = (pageIndex - 1) * this.pageSize;
    }

}
