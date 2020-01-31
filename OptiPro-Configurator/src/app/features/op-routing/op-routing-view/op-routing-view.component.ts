import { Component, OnInit } from '@angular/core';
import { CommonData, ColumnSetting } from 'src/app/core/data/CommonData';
import { RoutingService } from 'src/app/core/service/routing.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-op-routing-view',
    templateUrl: './op-routing-view.component.html',
    styleUrls: ['./op-routing-view.component.scss']
})
export class OpRoutingViewComponent implements OnInit {

    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";
    public commonData = new CommonData();

    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = Number(this.commonData.default_count);
    public skip: number = 0;

    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.routing;
    add_route_link = '/routing/add-edit';
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private rs: RoutingService, private router: Router, private commonservice: CommonService) { }
    show_table_footer: boolean = false;
    public showImportButton: boolean = false;
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public dataArray: any = [];
    public CheckedData: any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall: boolean = false;
    public isMultiDelete: boolean = false;
    public isColumnFilter: any = false;
    public menu_auth_index = '206';
    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;
    public showLookupLoader: boolean = false;

    public allowUnsort = true;
    public sort: SortDescriptor[];
    public gridView: GridDataResult;


    button_click1(data) {
        this.router.navigateByUrl('routing/add-edit/' + data.OPTM_MODELFEATUREID);
    }
    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_MODELFEATUREID;
    }


    show_association(data) {
        console.log("data ", data);
        return false;
    }

    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {

            this.showLoader = true;
            let row_data;
            if (this.CheckedData.length > 0) {
                row_data = this.CheckedData;
            } else {
                row_data = [{
                    CompanyDBID: sessionStorage.selectedComp, RoutingId: this.row_id,
                    GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
                }]
            }

            this.rs.DeleteRouting(row_data).subscribe(
                data => {
                    this.showLoader = false;
                    this.CheckedData = [];
                    this.isMultiDelete = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists") {
                            this.commonservice.show_notification(this.language.Refrence + ' at: ' + data[i].RoutingCode, 'error');
                            this.CheckedData = [];
                            this.selectall = false;
                        }
                        else if (data[i].IsDeleted == "1") {
                            this.commonservice.show_notification(this.language.DataDeleteSuccesfully + ' : ' + data[i].RoutingCode, 'error');
                            this.CheckedData = [];
                            this.selectall = false;
                            this.service_call(this.current_page, this.search_string);
                            this.router.navigateByUrl('routing/view');
                        }
                        else {
                            this.commonservice.show_notification(this.language.DataNotDelete + ' : ' + data[i].RoutingCode, 'error');
                        }
                    }
                    this.CheckedData = [];
                    this.selectall = false;
                    this.clearChildCheckbox();
                }, error => {
                    this.showLoader = false;
                    if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                        this.commonservice.isUnauthorized();
                    } else {
                        this.commonservice.show_notification(this.language.server_error, 'error');
                    }
                    return
                }
            )

        }
        this.show_dialog = false;
    }

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

    getcurrentPageSize(grid_value) {
        sessionStorage.setItem('defaultRecords', grid_value);
        this.skip = 0;
        this.selectedValue = grid_value;
        this.record_per_page = sessionStorage.getItem('defaultRecords');
    }

    getLookupValue($event) {

    }

    getPageValue() {
        if (this.selectedValue == null) {
            this.selectedValue = 10;
        }
        return this.selectedValue;
    }

    dataStateChanged(event) {
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
                        objcc.commonservice.show_notification(objcc.language.notAuthorisedScreen, 'error');
                        objcc.router.navigateByUrl('home');
                    }, 200);
                }
            }, error => {
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                    this.commonservice.isUnauthorized();
                } else {
                    this.commonservice.show_notification(this.language.server_error, 'error');
                }
                return
            });
        this.service_call(this.current_page, this.search_string);

    }
    public clearChildCheckbox() {
        let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if (child_checkbox_selector.length > 0) {
            for (let i = 0; i < child_checkbox_selector.length; i++) {
                child_checkbox_selector[i].checked = false;
            }
        }
    }
    service_call(page_number, search) {
        var dataset = this.rs.get_all_routing_data().subscribe(
            data => {
                console.log(data);
                if (data != undefined) {
                    if (data.length > 0) {
                        if (data[0].ErrorMsg == "7001") {
                            this.commonservice.RemoveLoggedInUser().subscribe();
                            this.commonservice.signOut(this.router, 'Sessionout');
                            this.showLoader = false;
                            return;
                        }
                    }
                }
                this.dataArray = data;
                this.loadServerData(this.dataArray);
                this.showLoader = false;
                this.CheckedData = [];
                this.selectall = false;
                this.clearChildCheckbox();
            },
            error => {
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

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = []
        this.selectall = false

        if (checkedvalue == true) {
            if (this.dataArray.length > 0) {
                this.selectall = true
                for (let i = 0; i < this.dataArray.length; ++i) {
                    this.CheckedData.push({
                        RoutingId: this.dataArray[i].OPTM_MODELFEATUREID,
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

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].RoutingId == row_data.OPTM_MODELFEATUREID) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            RoutingId: row_data.OPTM_MODELFEATUREID,
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
                    RoutingId: row_data.OPTM_MODELFEATUREID,
                    CompanyDBId: this.companyName,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }
        }
        else {
            this.CheckedData.push({
                RoutingId: row_data.OPTM_MODELFEATUREID,
                CompanyDBId: this.companyName,
                GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
        }
    }
}
