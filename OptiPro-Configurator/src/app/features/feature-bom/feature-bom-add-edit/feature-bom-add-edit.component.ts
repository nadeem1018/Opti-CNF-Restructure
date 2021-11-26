import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { FeaturebomService } from 'src/app/core/service/featurebom.service';
import { DialogService } from 'src/app/core/service/dialog.service';

@Component({
  selector: 'app-feature-bom-add-edit',
  templateUrl: './feature-bom-add-edit.component.html',
  styleUrls: ['./feature-bom-add-edit.component.scss']
})
export class FeatureBomAddEditComponent implements OnInit, DoCheck {
  @ViewChild("featureinputbox", { static: true }) _el: ElementRef;
  @ViewChild("button", { static: true }) _ele: ElementRef;
  // modalRef: BsModalRef;

  public feature_bom_data: any = [];
  public feature_bom_table: any = [];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/feature-bom/view';
  public lookupfor: string = '';
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public isExplodeButtonVisible: boolean = true;
  public isAssociatedBOMButtonVisible: boolean = true;
  public update_id: string = "";
  public companyName: string = "";
  public username: string = "";
  public typevaluefromdatabase: string = "";
  public typevaluecodefromdatabase: string = "";
  public defaultcheckbox: boolean = false;
  public currentrowindex: number;
  public isDisplayNameDisabled: boolean = false;
  public isTypeDisabled: boolean = false;
  public ishide: boolean = false;
  public isQuanityDisabled: boolean = true;
  public isQuanity: number;
  public isFeatureIdEnable: boolean = true;
  public FeatureLookupBtnhide: boolean = true;
  public showImageBlock: boolean = false;
  public inputTitle: any = "";
  public selectedImage = "";
  config_params: any;
  serviceData: any;
  counter = 0;
  public header_image_data: any;
  public detail_image_data: any = [];
  public live_tree_view_data = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  public allItemDataDetails: any = [];
  public row_image_data: any;
  public detail_select_options: any = '';
  public isPriceDisabled: boolean = false
  public pricehide: boolean = false;
  public isPropagateQtyDisable: boolean = false;
  public GetItemData = [];
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  public row_selection: number[] = [];
  public current_selected_row: any = [];
  public selectableSettings: any = [];
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  constructor(private route: Router, private fbom: FeaturebomService, private router: Router, private ActivatedRouter: ActivatedRoute, private httpclient: HttpClient, private CommonService: CommonService, private cdref: ChangeDetectorRef, private DialogService: DialogService) { }
  page_main_title = this.language.Bom_title;
  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public menu_auth_index: string = "202";
  public made_changes: boolean = false;
  public isDuplicateMode: boolean = false;
  public NewFeatureId = "";
  public expandedKeys: any[] = [];
  public ItemAttributeList: any = [];
  public CustomeAttributeList: any = [];
  public FeatureAttributeList: any = [];
  public isAttribute = this.CommonService.attributeMenu;
  public isModelLevel = false;

  getSelectedRowDetail(event) {
    CommonData.made_changes = true;
    if (event.selectedRows.length > 0) {
      this.current_selected_row = event.selectedRows[0].dataItem;
    } else {
      this.current_selected_row = [];
    }
  }

  canDeactivate() {
    if (CommonData.made_changes == true) {
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }


  navigateToFeatureOrModelBom(id) {
    this.route.navigateByUrl("feature-bom/add-edit/" + id);
    this.feature_bom_data = [];
    this.feature_bom_table = [];
    this.tree_data_json = [];

    this.getFeatureBomDetail(id);
  }
  navigateToMasterHeader(feature_id) {
    this.route.navigateByUrl('feature/edit/' + feature_id)
  }

  ngOnInit() {
    CommonData.made_changes = false;
    const element = document.getElementsByTagName('body')[0];
    this.selectableSettings = {
      mode: 'single'
    };

    element.classList.add('add-feature-bom');

    this.commonData.checkSession();
    this.detail_select_options = this.commonData.feature_bom_type();
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');

    // check screen authorisation - start
    this.CommonService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          this.CommonService.show_notification(this.language.notAuthorisedScreen, 'error');
          setTimeout(() => {
            this.router.navigateByUrl('home');
          }, 200);
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return
      });
    // check screen authorisation - end

    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      //CommonData.made_changes = true;
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.isFeatureIdEnable = false;
      this.FeatureLookupBtnhide = false;
      this._el.nativeElement.focus();
      this.showLoader = false;
      this.feature_bom_data.multi_select = 'false';
      this.feature_bom_data.custview_select = 'false';
      this.feature_bom_data.multi_select_disabled = true;
      this.feature_bom_data.feature_min_selectable = 1;
      this.feature_bom_data.feature_max_selectable = 1;
    }
    else {
      CommonData.made_changes = false;
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.isFeatureIdEnable = true;
      this.FeatureLookupBtnhide = true;

      if (this.ActivatedRouter.snapshot.url[0].path == "edit") {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = true;
        this.isFeatureIdEnable = true;
        this.FeatureLookupBtnhide = true;
        this.isDuplicateMode = false;
        this.isModelLevel = true;
      } else if (this.ActivatedRouter.snapshot.url[0].path == "add") {
        this.isUpdateButtonVisible = false;
        this.isSaveButtonVisible = true;
        this.isDeleteButtonVisible = false;
        this.isDuplicateMode = true;
        this.isFeatureIdEnable = false;
        this.FeatureLookupBtnhide = false;
      } else {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = false;
        this.isFeatureIdEnable = true;
        this.FeatureLookupBtnhide = true;
        this.isDuplicateMode = false;
      }
      this.getFeatureBomDetail(this.update_id)
    }

  }

  ngDoCheck() {
    this.isAttribute = this.CommonService.attributeMenu;
  }

  getFeatureBomDetail(id) {
    this.showLoader = true;
    if (this.isDuplicateMode) {
      this.NewFeatureId = this.update_id;
    }
    this.fbom.GetDataByFeatureId(id).subscribe(
      data => {
        if (data != undefined && data.LICDATA != undefined) {
          if (data.LICDATA[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        this.FeatureAttributeList = data.FeatureAttribute;
        this.ItemAttributeList = data.FeatureAttribute
        if (data.FeatureDetail.length > 0) {
          for (let i = 0; i < data.FeatureDetail.length; ++i) {
            if (data.FeatureDetail[i].OPTM_TYPE == 1) {
              this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_CHILDFEATUREID.toString()
              this.typevaluecodefromdatabase = data.FeatureDetail[i].child_code.toString()
              this.isDisplayNameDisabled = false
              this.isTypeDisabled = false
              this.ishide = false
              this.isQuanityDisabled = false
              this.isPriceDisabled = true
              this.pricehide = true
              this.isPropagateQtyDisable = false
              data.FeatureDetail[i].OPTM_QUANTITY = (data.FeatureDetail[i].OPTM_QUANTITY)
              this.isQuanity = data.FeatureDetail[i].OPTM_QUANTITY.toString()
              data.FeatureDetail[i]['is_slctUsAttr'] = false;
            }
            else if (data.FeatureDetail[i].OPTM_TYPE == 2) {
              this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_ITEMKEY.toString()
              this.typevaluecodefromdatabase = data.FeatureDetail[i].OPTM_ITEMKEY.toString()
              this.isDisplayNameDisabled = false
              this.isTypeDisabled = false
              this.ishide = false
              this.pricehide = false
              this.isQuanityDisabled = false
              this.isPriceDisabled = false
              this.isPropagateQtyDisable = false
              data.FeatureDetail[i].OPTM_QUANTITY = (data.FeatureDetail[i].OPTM_QUANTITY)
              this.isQuanity = data.FeatureDetail[i].OPTM_QUANTITY.toString(),
                data.FeatureDetail[i]['is_slctUsAttr'] = true;
            }
            else {
              this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_VALUE.toString()
              this.typevaluecodefromdatabase = data.FeatureDetail[i].OPTM_VALUE.toString()
              // this.isDisplayNameDisabled = false
              this.isDisplayNameDisabled = false
              //  this.isTypeDisabled = false
              this.isTypeDisabled = false
              this.isPropagateQtyDisable = true
              this.ishide = true
              this.pricehide = true
              this.isQuanityDisabled = true
              this.isPriceDisabled = true
              this.isQuanity = 0
              data.FeatureDetail[i]['is_slctUsAttr'] = true;
            }
            if (data.FeatureDetail[i].OPTM_DEFAULT == "Y") {
              this.defaultcheckbox = true
            }
            else {
              this.defaultcheckbox = false
            }
            if (data.FeatureDetail[i].OPTM_PROPOGATEQTY == "Y") {
              data.FeatureDetail[i].OPTM_PROPOGATEQTY = true
            }
            else {
              data.FeatureDetail[i].OPTM_PROPOGATEQTY = false
            }

            if (data.FeatureDetail[i].OPTM_SELUATTRIBUTE == "Y") {
              data.FeatureDetail[i].OPTM_SELUATTRIBUTE = true
            }
            else {
              data.FeatureDetail[i].OPTM_SELUATTRIBUTE = false
            }

            let is_accessory_disabled = false;
            if (data.FeatureDetail[i].OPTM_ACCESSORY == 'Y') {
              is_accessory_disabled = true;
            }

            //this.row_image_data = this.commonData.get_current_url() + data.FeatureDetail[i].OPTM_ATTACHMENT
            this.row_image_data = this.config_params.service_url + '/web' + data.FeatureDetail[i].OPTM_ATTACHMENT;

            this.counter = 0;
            if (this.feature_bom_table.length > 0) {
              this.counter = this.feature_bom_table.length
            }
            this.counter++;

            let print_on_report = false;
            let print_on_report_disabled = true;
            if (data.FeatureDetail[i].OPTM_TYPE == 2) {
              if (data.FeatureDetail[i].OPTM_PRINT_OPTN == 'Y' || data.FeatureDetail[i].OPTM_PRINT_OPTN == 'y') {
                print_on_report = true;
              } else {
                print_on_report = false;
              }

              print_on_report_disabled = false;
            } else {
              print_on_report = false;
              print_on_report_disabled = true;
            }

            if (data.FeatureDetail[i].OPTM_OPTIONAL == 'Y' || data.FeatureDetail[i].OPTM_OPTIONAL == 'y') {
              data.FeatureDetail[i].OPTM_OPTIONAL = true;
            } else {
              data.FeatureDetail[i].OPTM_OPTIONAL = false;
            }

            if (data.FeatureDetail[i].OPTM_RET_TO_INV == 'Y' || data.FeatureDetail[i].OPTM_RET_TO_INV == 'y') {
              data.FeatureDetail[i].OPTM_RET_TO_INV = true;
            } else {
              data.FeatureDetail[i].OPTM_RET_TO_INV = false;
            }





            this.feature_bom_table.push({
              rowindex: this.counter,
              OPTM_LINENO: data.FeatureDetail[i].OPTM_LINENO,
              FeatureId: data.FeatureDetail[i].OPTM_FEATUREID,
              type: data.FeatureDetail[i].OPTM_TYPE,
              type_value: this.typevaluefromdatabase.trim(),
              type_value_code: this.typevaluecodefromdatabase.trim(),
              display_name: data.FeatureDetail[i].OPTM_DISPLAYNAME,
              bom_description: data.FeatureDetail[i].OPTM_FEATUREDEC,
              OPTM_ABBREVIATION: data.FeatureDetail[i].OPTM_ABBREVIATION,
              OPTM_ITEMCODE_PRT:data.FeatureDetail[i].OPTM_ITEMCODE_PRT,
              OPTM_MODELLEVEL_DESC: data.FeatureDetail[i].OPTM_MODELLEVEL_DESC,
              quantity: this.isQuanity,
              default: this.defaultcheckbox,
              remark: data.FeatureDetail[i].OPTM_REMARKS,
              attachment: data.FeatureDetail[i].OPTM_ATTACHMENT,
              preview: this.row_image_data,
              propagate_qty: data.FeatureDetail[i].OPTM_PROPOGATEQTY,
              price_source_id: data.FeatureDetail[i].OPTM_PRICESOURCE,
              price_source: data.FeatureDetail[i].ListName,
              isDisplayNameDisabled: this.isDisplayNameDisabled,
              isTypeDisabled: this.isTypeDisabled,
              isQuanityDisabled: this.isQuanityDisabled,
              hide: this.ishide,
              pricehide: this.pricehide,
              isBomDescriptionDisabled: true,
              is_accessory: data.FeatureDetail[i].OPTM_ACCESSORY,
              is_accessory_disabled: is_accessory_disabled,
              isPropagateQtyDisable: this.isPropagateQtyDisable,
              isPriceDisabled: this.isPriceDisabled,
              CompanyDBId: sessionStorage.selectedComp,
              CreatedUser: data.FeatureDetail[i].OPTM_CREATEDBY,
              print_on_report: print_on_report,
              print_on_report_disabled: print_on_report_disabled,
              is_slctUsAttr: data.FeatureDetail[i].is_slctUsAttr,
              OPTM_SELUATTRIBUTE: data.FeatureDetail[i].OPTM_SELUATTRIBUTE,
              OPTM_RET_TO_INV: data.FeatureDetail[i].OPTM_RET_TO_INV,
              OPTM_OPTIONAL: data.FeatureDetail[i].OPTM_OPTIONAL,
            });
          }
        } else {
          this.route.navigateByUrl('feature/model/edit/' + id);
          return;
        }
        if (data.FeatureHeader.length > 0) {
          this.feature_bom_data.feature_code = data.FeatureHeader[0].OPTM_FEATURECODE;
          this.feature_bom_data.feature_id = data.FeatureDetail[0].OPTM_FEATUREID;
          this.feature_bom_data.feature_name = data.FeatureHeader[0].OPTM_DISPLAYNAME;
          this.feature_bom_data.feature_desc = data.FeatureHeader[0].OPTM_FEATUREDESC;
          this.feature_bom_data.image_path = data.FeatureHeader[0].OPTM_PHOTO;
          this.feature_bom_data.is_accessory = data.FeatureHeader[0].OPTM_ACCESSORY;


          if (data.FeatureHeader[0].OPTM_MODELLEVEL_DESC == 'Y') {
            this.feature_bom_data.OPTM_MODELLEVEL_DESC = true;
          }
          else {
            this.feature_bom_data.OPTM_MODELLEVEL_DESC = false;
          }

          if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
            this.detail_select_options = this.commonData.two_feature_bom_type();

          } else {
            this.detail_select_options = this.commonData.feature_bom_type();
          }

          if (data.FeatureHeader[0].OPTM_ISMULTISELECT == 'y' || data.FeatureHeader[0].OPTM_ISMULTISELECT == 'Y') {
            this.feature_bom_data.multi_select = 'true';
            this.feature_bom_data.multi_select_disabled = false;
          } else {
            this.feature_bom_data.multi_select = 'false';
            this.feature_bom_data.multi_select_disabled = true;
          }

          if (data.FeatureHeader[0].OPTM_ISCUSTOMVIEW == 'y' || data.FeatureHeader[0].OPTM_ISCUSTOMVIEW == 'Y') {
            this.feature_bom_data.custview_select = 'true';
          } else {
            this.feature_bom_data.custview_select = 'false';
          }

          this.feature_bom_data.feature_min_selectable = data.FeatureHeader[0].OPTM_MIN_SELECTABLE;

          if (this.feature_bom_data.feature_min_selectable == null && this.feature_bom_data.feature_min_selectable == undefined) {
            this.feature_bom_data.feature_min_selectable = 1;
          }


          this.feature_bom_data.feature_max_selectable = data.FeatureHeader[0].OPTM_MAX_SELECTABLE;
          if (this.feature_bom_data.feature_max_selectable == null && this.feature_bom_data.feature_max_selectable == undefined && this.feature_bom_data.feature_max_selectable == 0) {
            this.feature_bom_data.feature_max_selectable = 1;
          }

          if (this.feature_bom_data.image_path != "") {
            if (this.feature_bom_data.image_path != null) {
              // this.header_image_data = this.commonData.get_current_url() + this.feature_bom_data.image_path
              this.header_image_data = this.config_params.service_url + '/web' + this.feature_bom_data.image_path;
              this.showImageBlock = true;
            }
          }
          //     this.onExplodeClick('auto');
        }
        this.showLoader = false;
        if (this.isDuplicateMode) {
          this.feature_bom_data.feature_code = "";
          this.feature_bom_data.feature_name = "";
          this.feature_bom_data.feature_desc = "";
          this.feature_bom_data.feature_id = "";
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )

  }

  on_multiple_model_change() {
    CommonData.made_changes = true;
    if (this.feature_bom_data.multi_select == 'false') {
      this.feature_bom_data.multi_select_disabled = true;
    } else if (this.feature_bom_data.multi_select == 'true') {
      this.feature_bom_data.multi_select_disabled = false;
    }
    this.feature_bom_data.feature_min_selectable = 1;
    if (this.feature_bom_table.length > 0) {
      this.feature_bom_table.filter(function (obj) {
        return obj.default = false;
      });

    }
    this.feature_bom_data.feature_max_selectable = 1;
  }

  on_custome_view_change() {
    CommonData.made_changes = true;
    if (this.feature_bom_data.custview_select == 'true') {
      this.addAttribute();
    }

  }

  addAttribute() {

    if (this.update_id == "" || this.update_id == null) {
      this.serviceData = []
      this.lookupfor = 'customeview_lookup';
      this.showLookupLoader = false;
    } else {
      this.fbom.GetModelFeatureAttributeListByFeatureID(this.update_id).subscribe(
        data => {

          if (data.FeatureCustomAttribute.length > 0) {
            if (data.FeatureCustomAttribute[0].ErrorMsg == "7001") {
              CommonData.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.router, 'Sessionout');
              return;
            }

            this.lookupfor = 'customeview_lookup';
            this.showLookupLoader = false;
            this.serviceData = data.FeatureCustomAttribute;
          }
          else {
            this.lookupfor = 'customeview_lookup';
            this.showLookupLoader = false;
            //  this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
            // return;
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



  }

  validate_min_values(value, input_id) {
    CommonData.made_changes = true;
    if (this.feature_bom_data.multi_select == 'true') {

      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        value = 1;
        this.CommonService.show_notification(this.language.ValidNumber, 'error');
      } else if (/* value == 0 || */ value == '' || value == null || value == undefined) {
        value = 1;
        this.CommonService.show_notification(this.language.blank_or_zero_not_allowed_min_selectable, 'error');
      } else if (value < 0) {
        value = 1;
        this.CommonService.show_notification(this.language.negativeminselectablevalid, 'error');
      } else if (rgexp.test(value) == false) {
        value = 1;
        this.CommonService.show_notification(this.language.decimaleminselectablevalid, 'error');
      } else if (this.feature_bom_data.feature_min_selectable > this.feature_bom_data.feature_max_selectable) {
        value = 1;
        this.CommonService.show_notification(this.language.min_selectable_greater_than_max, 'error');
      }
      this.feature_bom_data[input_id] = (value);


      let inputValue = (<HTMLInputElement>document.getElementById(input_id));
      inputValue.value = value;

    } else if (this.feature_bom_data.multi_select == 'false') {
      this.feature_bom_data[input_id] = (value);
      if (value == 0) {
        if (this.feature_bom_table.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            this.feature_bom_table[i].default = false;
          }
        }
      } else {
        if (this.feature_bom_table.length > 0) {
          this.feature_bom_table[0].default = true;
        }
      }

    }
  }

  validate_max_values(value, input_id) {
    CommonData.made_changes = true;
    if (value == 0) {
      value = 1;
      this.feature_bom_data[input_id] = (value);
      this.CommonService.show_notification(this.language.max_selectable_quantityvalid, 'error');
    }
    else {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        value = 1;
        this.CommonService.show_notification(this.language.ValidNumber, 'error');
      } else if (value == 0 || value == '' || value == null || value == undefined) {
        value = 1;
        this.CommonService.show_notification(this.language.blank_or_zero_not_allowed_max_selectable, 'error');
      } else if (value < 0) {
        value = 1;
        this.CommonService.show_notification(this.language.negativemaxselectablevalid, 'error');
      } else if (rgexp.test(value) == false) {
        value = 1;
        this.CommonService.show_notification(this.language.decimalmaxselectablevalid, 'error');
      } else if (this.feature_bom_data.feature_max_selectable < this.feature_bom_data.feature_min_selectable) {
        value = 1;
        this.CommonService.show_notification(this.language.max_selectable_less_than_min, 'error');
      }
      this.feature_bom_data[input_id] = (value);

    }
    let inputValue = (<HTMLInputElement>document.getElementById(input_id));
    inputValue.value = value;
  }

  onAddRow() {
    if (this.validation("Add") == false) {
      return;
    }
    this.counter = 0;
    if (this.feature_bom_table.length > 0) {
      this.counter = this.feature_bom_table.length
    }
    this.counter++;
    let first_default = false;

    if (this.feature_bom_data.multi_select == 'true' || this.feature_bom_data.feature_min_selectable == '1') {
      if (this.feature_bom_table.length == 0) {
        first_default = true;
      }
    }


    let table_default_type = 1;

    let print_on_report_flag = false;
    let print_on_report_disabled_flag = true;
    let isSelectAttr = false;

    if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
      table_default_type = 2;
      isSelectAttr = true;

    }

    if (table_default_type == 2) {
      print_on_report_flag = true;
      print_on_report_disabled_flag = false;
    }

    this.feature_bom_table.push({
      rowindex: this.counter,
      OPTM_LINENO: this.counter,
      FeatureId: this.feature_bom_data.feature_id,
      type: table_default_type,
      OPTM_ABBREVIATION: "",
      OPTM_ITEMCODE_PRT:"",
      OPTM_MODELLEVEL_DESC: false,
      type_value: "",
      type_value_code: "",
      display_name: "",
      quantity: ("1"),
      default: first_default,
      remark: "",
      attachment: "",
      preview: "",
      propagate_qty: true,
      price_source: "",
      price_source_id: "",
      isDisplayNameDisabled: false,
      isBomDescriptionDisabled: true,
      isTypeDisabled: false,
      hide: false,
      is_accessory: 'N',
      is_accessory_disabled: false,
      isQuanityDisabled: false,
      isPriceDisabled: this.isPriceDisabled,
      isPropagateQtyDisable: false,
      pricehide: this.pricehide,
      CompanyDBId: sessionStorage.selectedComp,
      CreatedUser: this.username,
      print_on_report: print_on_report_flag,
      print_on_report_disabled: print_on_report_disabled_flag,
      is_slctUsAttr: isSelectAttr,
      OPTM_SELUATTRIBUTE: false,
      OPTM_OPTIONAL: true,
      OPTM_RET_TO_INV: false
    });
    CommonData.made_changes = true;
  };

  uploaddetailfile(files: any, rowindex) {
    if (files.length === 0)
      return;
    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }

    this.fbom.UploadFeatureBOM(formData).subscribe(data => {
      if (data.body === "False") {
        this.CommonService.show_notification(this.language.filecannotupload, 'error');
      }
      else {
        if (this.feature_bom_table.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            if (this.feature_bom_table[i].rowindex === rowindex) {
              this.feature_bom_table[i].attachment = data.body;
              this.feature_bom_table[i].preview = this.config_params.service_url + '/web' + data.body;
              console.log(this.feature_bom_table[i].preview);
              //this.feature_bom_table[i].preview = this.commonData.get_current_url() + data.body
              // this.detail_image_data.push(this.feature_bom_table[i].attachment)  

              if (this.detail_image_data.length > 0) {
                for (let idtlimg = 0; idtlimg < this.detail_image_data.length; ++idtlimg) {
                  if (this.detail_image_data[idtlimg].index == i) {
                    this.detail_image_data[idtlimg].value = this.feature_bom_table[i].attachment
                  }
                }

              }
              else {
                this.detail_image_data.push({
                  index: i,
                  value: this.feature_bom_table[i].attachment
                })
              }

            }
          }
        }
      }
    },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }
  openAttributeLookup(rowindex) {
    this.serviceData = {};
    this.serviceData.attributeList = [];
    this.serviceData.rowindex = rowindex;
    this.serviceData.type = "FeatureBom";
    this.lookupfor = '';
    let lineNo = 0;
    this.serviceData.feature_id = this.feature_bom_data.feature_id;

    if (this.feature_bom_table.length > 0) {
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.feature_bom_table[i].rowindex === rowindex) {
          lineNo = this.feature_bom_table[i].OPTM_LINENO;
          break;
        }
      }
    }

    this.serviceData.featureCode = this.feature_bom_data.feature_code;
    this.serviceData.rowId = lineNo;
    this.fbom.GetFeatureBOMAttributeListByLine(this.feature_bom_data.feature_id, lineNo).subscribe(
      data => {

        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }

          this.lookupfor = 'add_attribute_lookup';
          this.showLookupLoader = false;
          this.serviceData.attributeList = data;
          this.inputTitle = this.feature_bom_data.feature_code;
        }
        else {
          this.lookupfor = 'add_attribute_lookup';
          this.showLookupLoader = false;
          //  this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          // return;
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

  onViewAttribute() {
    this.serviceData = {};
    this.serviceData.attributeList = [];
    this.serviceData.atttributeColumn = [];
    let selectAttributesList = [];
    this.serviceData.type = "FeatureBom"
    var featureName = this.feature_bom_data.feature_name;
    var featureCode = this.feature_bom_data.feature_code;
    this.serviceData.featureName = featureName;
    this.fbom.ViewAttributes(this.feature_bom_data.feature_id).subscribe(
      data => {

        if (data.ViewAttributes.length > 0) {
          if (data.ViewAttributes[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }

          this.lookupfor = 'view_attribute_lookup';
          this.inputTitle = this.feature_bom_data.featureCode
          this.showLookupLoader = false;
          this.serviceData.attributeList = data.ViewAttributes;
          this.serviceData.atttributeColumn = data.FeatureAttribute;
        }
        else {
          this.lookupfor = 'view_attribute_lookup';
          this.inputTitle = this.feature_bom_data.featureCode
          this.showLookupLoader = false;
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

  onDeleteRow(rowindex) {
    CommonData.made_changes = true;
    if (this.feature_bom_table.length > 0) {
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.feature_bom_table[i].rowindex === rowindex) {
          let display_name = this.feature_bom_table[i].display_name;
          if (this.tree_data_json.length > 0) {
            let remove_tree_data = this.tree_data_json.filter(function (obj) {
              return (obj['component'] == display_name);
            });
            if (remove_tree_data.length > 0) {
              let tree_element_child = this.tree_data_json.filter(function (obj) {
                return obj['parentId'] == remove_tree_data[0]['component'];
              });

              for (let j = 0; j < this.tree_data_json.length; j++) {
                if (remove_tree_data[0]['live_row_id'] == this.tree_data_json[j]['live_row_id']) {
                  this.tree_data_json.splice(j, 1);
                }
              }
            }
          }
          var removeItem = this.feature_bom_table[i];
          var ItemAttributeDataList = this.ItemAttributeList.filter(function (obj) {
            return obj['OPTM_FEATUREDTLROWID'] != removeItem.OPTM_LINENO;
          });
          this.ItemAttributeList = ItemAttributeDataList;
          this.feature_bom_table.splice(i, 1);
          i = i - 1;

        }
        else {
          this.feature_bom_table[i].rowindex = i + 1;
        }
      }
    }

    this.current_selected_row = [];
    this.row_selection = [];
  }

  onSaveClick() {
    if (this.validation("Save") == false) {
      return;
    }

    if (this.feature_bom_table.length > 0) {
      if (this.isDuplicateMode) {
        this.feature_bom_table[0].id = 0;

      }
      else {
        this.feature_bom_table[0].id = this.update_id;
      }
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.feature_bom_table[i].display_name == "" || this.feature_bom_table[i].display_name == " ") {
          let currentrow = i + 1;
          //this.toastr.error('', this.language.DisplayNameRequired + currentrow, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.DisplayNameRequired + currentrow, 'error');
          this.showLookupLoader = false;
          return;
        }
        if (this.feature_bom_data.OPTM_MODELLEVEL_DESC) {
          let currentrow = i + 1;
          if (this.feature_bom_table[i].OPTM_ABBREVIATION == "") {
            this.CommonService.show_notification(this.language.Abbreviation_field + currentrow, 'error');
            return false;
          }
          if (this.feature_bom_table[i].OPTM_ITEMCODE_PRT == "") {
            this.CommonService.show_notification(this.language.itemcode_field + currentrow, 'error');
            return false;
          }
        }
      }

      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.isDuplicateMode) {
          this.NewFeatureId = this.feature_bom_data.feature_id;
          this.feature_bom_table[i].FeatureId = this.NewFeatureId;
        }

        if (this.feature_bom_data.custview_select == 'false') {
          this.feature_bom_table[i].OPTM_ISCUSTOMVIEW = "N"
        }
        else {
          this.feature_bom_table[i].OPTM_ISCUSTOMVIEW = "Y"
        }

        if (this.feature_bom_data.multi_select == 'false') {
          this.feature_bom_table[i].multi_select = "N"
        }
        else {
          this.feature_bom_table[i].multi_select = "Y"
        }

        this.feature_bom_table[i].feature_min_selectable = this.feature_bom_data.feature_min_selectable;
        this.feature_bom_table[i].feature_max_selectable = this.feature_bom_data.feature_max_selectable;
        if (this.feature_bom_table[i].default === false) {
          this.feature_bom_table[i].default = "N"
        }
        else {
          this.feature_bom_table[i].default = "Y"
        }

        if (this.feature_bom_table[i].propagate_qty === false) {
          this.feature_bom_table[i].propagate_qty = "N"
        }
        else {
          this.feature_bom_table[i].propagate_qty = "Y"
        }

        if (this.feature_bom_table[i].OPTM_SELUATTRIBUTE == false) {
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = "N"
        }
        else {
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = "Y"
        }

        if (this.feature_bom_table[i].OPTM_OPTIONAL == false) {
          this.feature_bom_table[i].OPTM_OPTIONAL = "N"
        }
        else {
          this.feature_bom_table[i].OPTM_OPTIONAL = "Y"
        }

        if (this.feature_bom_table[i].OPTM_RET_TO_INV == false) {
          this.feature_bom_table[i].OPTM_RET_TO_INV = "N"
        }
        else {
          this.feature_bom_table[i].OPTM_RET_TO_INV = "Y"
        }

        this.feature_bom_table[i].quantity = this.feature_bom_table[i].quantity.toString();
        if (this.feature_bom_data.OPTM_MODELLEVEL_DESC == false || this.feature_bom_data.OPTM_MODELLEVEL_DESC == undefined) {
          this.feature_bom_table[i].OPTM_MODELLEVEL_DESC = "N"
        }
        else {
          this.feature_bom_table[i].OPTM_MODELLEVEL_DESC = "Y"
        }
        if (this.feature_bom_table[i].print_on_report === false) {
          this.feature_bom_table[i].print_on_report = "N"
        }
        else {
          this.feature_bom_table[i].print_on_report = "Y"
        }
        var featureBomItem = this.feature_bom_table[i];
        this.ItemAttributeList = this.ItemAttributeList.filter(function (obj) {
          if (obj['OPTM_FEATUREDTLROWID'] == featureBomItem.OPTM_LINENO) {
            obj['rowindex'] = featureBomItem.rowindex
          }
          return obj;
        })

      }
    }
    var featureId = this.feature_bom_data.feature_id;
    var featureCode = this.feature_bom_data.feature_code;
    this.CustomeAttributeList.filter(function (obj) {
      obj['OPTM_FEATUREID'] = featureId;
      obj['OPTM_FEATURECODE'] = featureCode;
      return obj;
    });
    this.showLookupLoader = true;
    console.log(this.feature_bom_table);
    // let FeatureBomModelData: any = {};
    // FeatureBomModelData.FeatureBom = [];
    // FeatureBomModelData.ItemAttributeList = [];
    // FeatureBomModelData.FeatureBom = this.feature_bom_table;
    // FeatureBomModelData.ItemAttributeList = this.ItemAttributeList;
    this.fbom.SaveModelBom(this.feature_bom_table, this.ItemAttributeList, this.CustomeAttributeList).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          CommonData.made_changes = false
          this.CommonService.RemoveLoggedInUser().subscribe();
          this.CommonService.signOut(this.route, 'Sessionout');
          return;
        }

        if (data === "True") {
          CommonData.made_changes = false
          //this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.DataSaved, 'success');
          this.route.navigateByUrl('feature-bom/view');
          return;
        }
        else if (data === "Cyclic Reference") {
          //this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.cyclic_ref_restriction, 'error');
          return;
        }
        else if (data === "AlreadyExist") {
          //this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.DuplicateCode, 'error');
          return;
        }
        else if (data === "MoreDefaultThanMaxSelectable") {
          //this.toastr.error('', this.language.MoreDefaultThanMaxSelectable, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.MoreDefaultThanMaxSelectable, 'error');
          return;
        }
        else {
          //this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
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

  on_bom_type_change(selectedvalue, rowindex) {

    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = "";
        this.feature_bom_table[i].type_value_code = "";
        this.feature_bom_table[i].display_name = ""
        this.feature_bom_table[i].bom_description = ""
        this.feature_bom_table[i].OPTM_ABBREVIATION = ""
        this.feature_bom_table[i].OPTM_ITEMCODE_PRT = ""
        this.feature_bom_table[i].is_accessory = "N"
        if (selectedvalue == 3) {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = true
          this.feature_bom_table[i].type = 3
          this.feature_bom_table[i].quantity = ("0");
          this.feature_bom_table[i].isQuanityDisabled = true
          this.feature_bom_table[i].isPriceDisabled = true
          this.feature_bom_table[i].pricehide = true
          this.feature_bom_table[i].isPropagateQtyDisable = true
          this.feature_bom_table[i].price_source = ""
          this.feature_bom_table[i].price_source_id = ""
          this.feature_bom_table[i].print_on_report = false;
          this.feature_bom_table[i].print_on_report_disabled = true;
          this.feature_bom_table[i].is_slctUsAttr = true;
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = false;
          this.feature_bom_table[i].OPTM_OPTIONAL = true;
          this.feature_bom_table[i].OPTM_RET_TO_INV = false;
        }
        else {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = false
          this.feature_bom_table[i].isPropagateQtyDisable = false
          if (selectedvalue == 2) {
            this.feature_bom_table[i].type = 2
            this.feature_bom_table[i].quantity = ("1");
            this.feature_bom_table[i].isQuanityDisabled = false
            this.feature_bom_table[i].isPriceDisabled = false
            this.feature_bom_table[i].pricehide = false
            this.feature_bom_table[i].print_on_report = true;
            this.feature_bom_table[i].print_on_report_disabled = false;
            this.feature_bom_table[i].is_slctUsAttr = true;
            this.feature_bom_table[i].OPTM_SELUATTRIBUTE = false;
            this.feature_bom_table[i].OPTM_OPTIONAL = true;
            this.feature_bom_table[i].OPTM_RET_TO_INV = false;
          }
          else {
            this.feature_bom_table[i].type = 1
            this.feature_bom_table[i].quantity = ("1");
            this.feature_bom_table[i].isQuanityDisabled = false
            this.feature_bom_table[i].isPriceDisabled = true
            this.feature_bom_table[i].pricehide = true
            this.feature_bom_table[i].price_source = ""
            this.feature_bom_table[i].price_source_id = "";
            this.feature_bom_table[i].print_on_report = false;
            this.feature_bom_table[i].print_on_report_disabled = true;
            this.feature_bom_table[i].is_slctUsAttr = false;
            this.feature_bom_table[i].OPTM_SELUATTRIBUTE = false;
            this.feature_bom_table[i].OPTM_OPTIONAL = true;
            this.feature_bom_table[i].OPTM_RET_TO_INV = false;
          }
        }


      }
    }

  }

  on_type_change(selectedvalue, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex;
    this.showLookupLoader = true;
    this.getFeatureDetails(this.feature_bom_data.feature_id, "Detail", selectedvalue);

  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex;
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (this.feature_bom_table[i].type == 1 || this.feature_bom_table[i].type == 2) {

          if (value == 0) {
            value = 1;
            this.feature_bom_table[i].quantity = (value);
            // this.toastr.error('', this.language.quantityvalid, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.quantityvalid, 'error');
          }
          else {
            var rgexp = /^\d+$/;
            if (isNaN(value) == true) {
              value = 1;
              // this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.ValidNumber, 'error');
            } else if (value == 0 || value == '' || value == null || value == undefined) {
              value = 1;
              // this.toastr.error('', this.language.blank_or_zero_not_allowed, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.blank_or_zero_not_allowed, 'error');
            } else if (value < 0) {
              value = 1;
              // this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.negativequantityvalid, 'error');
            } else if (rgexp.test(value) == false) {
              value = 1;
              // this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.decimalquantityvalid, 'error');
            }
            this.feature_bom_table[i].quantity = (value);

          }
          let feature_quantity = (<HTMLInputElement>document.getElementsByClassName("feature_quantity")[rowindex - 1]);
          feature_quantity.value = value;
        }
      }

    }
    this.cdref.detectChanges()
  }

  on_remark_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].remark = value
      }
    }
  }

  on_displayname_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].display_name = value

        this.live_tree_view_data.push({ "display_name": value, "tree_index": this.currentrowindex });
      }
    }
  }
  on_description_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].bom_description = value

        //  this.live_tree_view_data.push({ "display_name": value, "tree_index": this.currentrowindex });
      }
    }
  }

  on_abbreviation_description_change(value, rowindex) {

    this.currentrowindex = rowindex
    CommonData.made_changes = true;
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].OPTM_ABBREVIATION = value;
      }
    }
  }

  on_itemcode_change(value, rowindex)
  {
    this.currentrowindex = rowindex
    CommonData.made_changes = true;
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].OPTM_ITEMCODE_PRT = value;
      }
    }
  }

  on_typevalue_change(value, rowindex, code, type_value_code) {
    var iIndex;
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    iIndex = this.currentrowindex - 1;
    for (let j = 0; j < this.feature_bom_table.length; j++) {
      var psTypeCode = this.feature_bom_table[j].type_value_code;
      if (psTypeCode != undefined && psTypeCode != "") {
        if (psTypeCode.toUpperCase() == code.toUpperCase()) {
          this.CommonService.show_notification(this.language.DuplicateId, 'error');
          type_value_code.value = "";
          return;
        }
      }

    }

    for (var i = 0; i < this.feature_bom_table.length; i++) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = value;
        this.feature_bom_table[i].type_value_code = code;
        if (this.feature_bom_table[i].type == 1) {
          this.fbom.onFeatureIdChange(this.feature_bom_table[i].type_value_code).subscribe(
            data => {
              if (data === "False") {
                // this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
                this.CommonService.show_notification(this.language.InvalidFeatureId, 'error');
                this.feature_bom_table[iIndex].type_value = "";
                this.feature_bom_table[iIndex].type_value_code = "";
                this.feature_bom_table[iIndex].is_accessory = "N";
                this.feature_bom_table[iIndex].is_accessory_disabled = false;
                this.feature_bom_table[iIndex].default = false;
                this.feature_bom_table[iIndex].display_name = "";
                type_value_code.value = "";
                return;
              }
              else {

                this.feature_bom_table[iIndex].type_value = data;
                this.checkFeaturesAlreadyAddedinParent(value, this.feature_bom_table[iIndex].type_value, iIndex, "change");
              }
            },
            error => {
              if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                this.CommonService.isUnauthorized();
              }
              return;
            })
        }
        else if (this.feature_bom_table[i].type == 2) {
          this.fbom.onItemIdChange(this.feature_bom_table[i].type_value_code).subscribe(
            data => {

              if (data != undefined && data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  CommonData.made_changes = false;
                  this.CommonService.RemoveLoggedInUser().subscribe();

                  return;
                }
              }

              if (data === "False") {
                //  this.toastr.error('', this.language.Invalid_feature_item_value, this.commonData.toast_config);
                this.CommonService.show_notification(this.language.Invalid_feature_item_value, 'error');
                this.feature_bom_table[iIndex].type_value = "";
                this.feature_bom_table[iIndex].type_value_code = "";
                this.feature_bom_table[iIndex].is_accessory = "N";
                this.feature_bom_table[iIndex].is_accessory_disabled = false;
                this.feature_bom_table[iIndex].default = false;
                this.feature_bom_table[iIndex].display_name = "";
                this.feature_bom_table[iIndex].price_source = "";
                this.feature_bom_table[iIndex].price_source_id = "";
                type_value_code.value = "";
                return;
              }
              else {
                this.lookupfor = "";
                this.feature_bom_table[iIndex].type_value = data;
                // this.getItemDetails(this.feature_bom_table[iIndex].type_value);
                this.getItemDetailsOnChange(this.feature_bom_table[iIndex].type_value);
              }
            },
            error => {
              if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                this.CommonService.isUnauthorized();
              }
              return;
            })
        }
        else {
          this.feature_bom_table[i].type_value = code;
          this.feature_bom_table[i].type_value_code = code;
          this.live_tree_view_data.push({ "display_name": code, "tree_index": this.currentrowindex, "branchType": 'value', "icon": 'value' });

        }
      }
    }


  }

  on_defualt_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].default = true;
          console.log(this.feature_bom_table[i]);
        }
        else {
          this.feature_bom_table[i].default = false;
          console.log(this.feature_bom_table[i]);
        }
      }
      else {
        if (this.feature_bom_data.multi_select == 'false') {
          this.feature_bom_table[i].default = false
        }
      }
    }

  }

  on_slctUsAttr_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = true;
        }
        else {
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = false;
        }
      }
      else {
        if (this.feature_bom_data.multi_select == 'false') {
          this.feature_bom_table[i].OPTM_SELUATTRIBUTE = false
        }
      }
    }
  }



  getLookupValue($event) {
    this.inputTitle = "";
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    if (this.lookupfor == 'add_attribute_lookup') {

      if (this.ItemAttributeList.length > 0) {
        var itemAttributeList = $event;
        var ItemAttributeDataList = this.ItemAttributeList.filter(function (obj) {
          return obj['OPTM_FEATUREDTLROWID'] != itemAttributeList[0].OPTM_FEATUREDTLROWID;
        });

        this.ItemAttributeList = ItemAttributeDataList;
        for (var index in itemAttributeList) {
          this.ItemAttributeList.push(itemAttributeList[index]);
        }
      } else {
        this.ItemAttributeList.push($event[0]);
      }


      console.log(this.feature_bom_table);

    } else if (this.lookupfor == 'customeview_lookup') {
      this.CustomeAttributeList = $event;
      console.log(this.feature_bom_table);

    } else if (this.lookupfor == 'feature_lookup') {
      CommonData.made_changes = true;
      this.feature_bom_data.feature_id = $event[0];
      this.feature_bom_data.feature_code = $event[1];
      this.getFeatureDetails($event[0], "Header", 0);
      this.isModelLevel = true;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.lookupfor = 'Item_Detail_lookup';
      CommonData.made_changes = true;
      for (let j = 0; j < this.feature_bom_table.length; j++) {
        var psTypeCode = this.feature_bom_table[j].type_value_code;
        if (psTypeCode != undefined && psTypeCode != "") {
          if (psTypeCode.toUpperCase() == $event[0].toUpperCase()) {
            //  this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.DuplicateId, 'error');
            //  $($event[0]).val("");
            return;
          }
        }

      }
      this.getItemDetails($event[0]);

    }
    else if (this.lookupfor == 'feature_Detail_lookup') {
      //call the method cyclic chk
      CommonData.made_changes = true;
      for (let j = 0; j < this.feature_bom_table.length; j++) {
        var psTypeCode = this.feature_bom_table[j].type_value_code;
        if (psTypeCode != undefined && psTypeCode != "") {
          if (psTypeCode.toUpperCase() == $event[1].toUpperCase()) {
            // this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.DuplicateId, 'error');
            //  $($event[1]).val("");
            return;
          }
        }

      }

      this.checkFeaturesAlreadyAddedinParent($event[0], "", this.currentrowindex - 1, "lookup");
    }
    else if (this.lookupfor == 'Price_lookup') {
      CommonData.made_changes = true;
      this.getPriceDetails($event[1], $event[0], this.currentrowindex);
    }

  }

  getPriceDetails(price_list_name, price, index) {
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === index) {
        this.feature_bom_table[i].price_source = price_list_name.toString()
        this.feature_bom_table[i].price_source_id = price.toString()
      }
    }
  }

  openFeatureLookUp() {
    this.showLookupLoader = true;
    CommonData.made_changes = true;
    console.log('inopen feature');
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureList().subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
          console.log(this.serviceData);

          var objss = this;
          var language = this.language;
          this.serviceData.filter(function (obj) {
            if (obj.OPTM_ACCESSORY == "Y") {
              obj.OPTM_ACCESSORY = language.YES;
            } else if (obj.OPTM_ACCESSORY == "N") {
              obj.OPTM_ACCESSORY = language.NO;
            }
          })

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          // this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
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

  getItemDetailsOnChange(ItemKey) {

    this.fbom.getItemDetails(ItemKey).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
              this.feature_bom_table[i].type_value = data[0].ItemKey;
              this.feature_bom_table[i].type = 2
              this.feature_bom_table[i].type_value_code = data[0].ItemKey;
              this.feature_bom_table[i].is_accessory = 'N';
              this.feature_bom_table[i].is_accessory_disabled = false;
              this.feature_bom_table[i].default = false;
              this.feature_bom_table[i].display_name = data[0].Description;
              this.feature_bom_table[i].bom_description = data[0].Description;
              this.feature_bom_table[i].price_source = data[0].ListName;
              this.feature_bom_table[i].price_source_id = data[0].PriceListID;
              this.live_tree_view_data.push({ "display_name": data[0].Description, "tree_index": this.currentrowindex, "branchType": 'item', "icon": 'item' });
            }
          }
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return
      })
  }

  getSelectedItemDetails(ItemKey) {
    let data = this.allItemDataDetails.filter(function (obj) {
      return obj.ItemKey == ItemKey;
    });
    return data;
  }

  getItemDetails(ItemKey) {

    let selectedDataDetails: any = [];
    selectedDataDetails = this.getSelectedItemDetails(ItemKey);

    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = selectedDataDetails[0].ItemKey;
        this.feature_bom_table[i].type = 2
        this.feature_bom_table[i].type_value_code = selectedDataDetails[0].ItemKey;
        this.feature_bom_table[i].is_accessory = 'N';
        this.feature_bom_table[i].is_accessory_disabled = false;
        this.feature_bom_table[i].default = false;
        this.feature_bom_table[i].bom_description = selectedDataDetails[0].Description;
        this.feature_bom_table[i].OPTM_ABBREVIATION = selectedDataDetails[0].OPTM_ABBREVIATION;
        this.feature_bom_table[i].OPTM_ITEMCODE_PRT = selectedDataDetails[0].OPTM_ITEMCODE_PRT;
        this.feature_bom_table[i].display_name = selectedDataDetails[0].Description;
        this.feature_bom_table[i].price_source = selectedDataDetails[0].ListName;
        this.feature_bom_table[i].price_source_id = selectedDataDetails[0].PriceListID;
        this.live_tree_view_data.push({ "display_name": selectedDataDetails[0].Description, "tree_index": this.currentrowindex, "branchType": 'item', "icon": 'item' });
      }
    }

  }

  getFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');
    this.serviceData = []
    this.allItemDataDetails = [];
    //this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureDetails(feature_code, press_location, index).subscribe(
      data => {

        this.allItemDataDetails = data;

        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.showLookupLoader = false;
          if (press_location == "Header") {
            if (this.lookupfor == 'feature_lookup') {
              // this.feature_bom_data.feature_id = data;
              this.feature_bom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.feature_bom_data.feature_desc = data[0].OPTM_FEATUREDESC;
              this.feature_bom_data.image_path = data[0].OPTM_PHOTO;
              this.feature_bom_data.is_accessory = data[0].OPTM_ACCESSORY;
              this.feature_bom_data.OPTM_MODELLEVEL_DESC = data[0].OPTM_MODELLEVEL_DESC;
              if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
                //this.detail_select_options = this.commonData.less_bom_type;
                this.detail_select_options = this.commonData.two_feature_bom_type();
                this.pricehide = false
                this.isPriceDisabled = false;

                this.feature_bom_data.multi_select = 'false';
                this.feature_bom_data.multi_select_disabled = true;
                this.feature_bom_data.feature_min_selectable = 1;
                this.feature_bom_data.feature_max_selectable = 1;
                this.feature_bom_data.is_accessory_disabled = true;
              } else {
                //this.detail_select_options = this.commonData.bom_type;
                this.detail_select_options = this.commonData.feature_bom_type();
                this.pricehide = true
                this.isPriceDisabled = true;
                this.feature_bom_data.is_accessory_disabled = false;
              }
              this.showImageBlock = false;
              if (this.feature_bom_data.image_path != null) {
                if (this.feature_bom_data.image_path != "") {
                  //this.header_image_data = this.commonData.get_current_url() + this.feature_bom_data.image_path;
                  this.header_image_data = this.config_params.service_url + '/web' + this.feature_bom_data.image_path;
                  this.showImageBlock = true;
                }
              }
              if (this.feature_bom_table.length > 0) {
                if (!this.isDuplicateMode) {
                  this.feature_bom_table = [];
                }
              }
            }
            else {
              // this.feature_bom_table=data;
              for (let i = 0; i < this.feature_bom_table.length; ++i) {
                if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
                  this.feature_bom_table[i].type_value = data[0].OPTM_FEATUREID.toString();
                  this.feature_bom_table[i].type_value_code = data[0].OPTM_FEATURECODE.toString();
                  this.feature_bom_table[i].is_accessory = data[0].OPTM_ACCESSORY;
                  if (data[0].OPTM_ACCESSORY == 'y' || data[0].OPTM_ACCESSORY == 'Y') {
                    this.feature_bom_table[i].is_accessory_disabled = true;
                  } else {
                    this.feature_bom_table[i].is_accessory_disabled = false;
                    this.feature_bom_table[i].default = false;
                  }

                  this.feature_bom_table[i].display_name = data[0].OPTM_DISPLAYNAME;
                  this.feature_bom_table[i].feature_desc = data[0].OPTM_FEATUREDESC;
                  if (data[0].OPTM_PHOTO != null && data[0].OPTM_PHOTO != "") {
                    //this.feature_bom_table[i].preview = this.commonData.get_current_url() + data[0].OPTM_PHOTO;
                    this.feature_bom_table[i].preview = this.config_params.service_url + '/web' + data[0].OPTM_PHOTO;

                    this.feature_bom_table[i].attachment = data[0].OPTM_PHOTO;
                  }


                }
              }
            }
            this.live_tree_view_data.push({ "display_name": data[0].OPTM_DISPLAYNAME, "tree_index": this.currentrowindex, "branchType": 'feature', "icon": 'feature' });
          }
          else {
            if (index == 1) {
              this.lookupfor = 'feature_Detail_lookup';
            }
            else {
              this.lookupfor = 'Item_Detail_lookup';
            }

            this.serviceData = data;
          }
        }
        else {
          this.showLookupLoader = false;
          this.lookupfor = "";
          this.serviceData = [];
          //this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return
      }
    )
  }

  openPriceLookUp(ItemKey, rowindex) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.currentrowindex = rowindex;
    CommonData.made_changes = true;
    this.fbom.GetPriceList(ItemKey).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.lookupfor = 'Price_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          //  this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return
      }
    )
  }

  enlage_image(image) {
    this.showLookupLoader = true;
    if (image) {
      this.lookupfor = 'large_image_view';
      this.selectedImage = image;
      this.showLookupLoader = false;
      console.log(this.selectedImage);
    }
  }

  getLookupValues($event) {
    this.lookupfor = '';
    this.selectedImage = '';
  }

  validation(btnpress) {
    if (this.feature_bom_data.feature_id == "" || this.feature_bom_data.feature_id == null) {
      // this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      this.CommonService.show_notification(this.language.FeatureCodeBlank, 'error');
      return false;
    }

    if (btnpress == "Save") {
      if (this.feature_bom_table.length == 0) {
        // this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
        this.CommonService.show_notification(this.language.Addrow, 'error');
        return false;
      }
      else {
        for (let i = 0; i < this.feature_bom_table.length; ++i) {
          let currentrow = i + 1;
          if (this.feature_bom_table[i].type == 1 && this.feature_bom_table[i].type_value == "") {
            // this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.SelectFeature + currentrow, 'error');
            return false;
          }
          if (this.feature_bom_table[i].type == 2 && this.feature_bom_table[i].type_value == "") {
            // this.toastr.error('', this.language.SelectItem + currentrow, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.SelectItem + currentrow, 'error');
            return false;
          }
          if (this.feature_bom_table[i].type == 3 && this.feature_bom_table[i].type_value_code == "") {
            // this.toastr.error('', this.language.SelectValue + currentrow, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.SelectValue + currentrow, 'error');
            return false;
          }
          if (this.feature_bom_table[i].quantity === "") {
            // this.toastr.error('', this.language.quantityblank + currentrow, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.quantityblank + currentrow, 'error');
            return false;
          }
        }

        let total_rows = this.feature_bom_table.length;

        let temp_acc = this.feature_bom_table.filter(function (obj) {
          return (obj.is_accessory == 'Y' && obj.type == 1) ? obj : ''
        });
        let total_acc_rows = (temp_acc != undefined) ? temp_acc.length : 0;


        let total_detail_elements = (total_rows - total_acc_rows);

        if (this.feature_bom_data.multi_select_disabled == false) {

          if (total_detail_elements < this.feature_bom_data.feature_min_selectable) {
            // this.toastr.error('', this.language.min_selectable_greater_total_acc, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.min_selectable_greater_total_acc, 'error');
            return false;
          }

          if (total_detail_elements < this.feature_bom_data.feature_max_selectable) {
            // this.toastr.error('', this.language.max_selectable_greater_total_acc, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.max_selectable_greater_total_acc, 'error');
            return false;
          }

          let default_rows = this.feature_bom_table.filter(function (obj) {
            return ((obj.is_accessory == 'N' || obj.is_accessory == undefined || obj.is_accessory == null) && obj.default == true) ? obj : "";
          });

          if (default_rows.length > this.feature_bom_data.feature_max_selectable) {
            // this.toastr.error('', this.language.default_more_than_max_sel, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.default_more_than_max_sel, 'error');
            return false;
          }

        }
      }

    }


  }

  on_propagate_qty_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        console.log('qty value ' + value);
        if (value.checked == true) {
          this.feature_bom_table[i].propagate_qty = true
        }
        else {
          this.feature_bom_table[i].propagate_qty = false
        }
      }
    }
  }

  print_on_report_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        console.log('print_on_report value ' + value);
        if (value.checked == true) {
          this.feature_bom_table[i].print_on_report = true
        }
        else {
          this.feature_bom_table[i].print_on_report = false
        }
      }
    }
  }

  optm_return_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].OPTM_RET_TO_INV = true
        }
        else {
          this.feature_bom_table[i].OPTM_RET_TO_INV = false
        }
      }
    }
  }

  optm_optional_change(value, rowindex) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].OPTM_OPTIONAL = true
        }
        else {
          this.feature_bom_table[i].OPTM_OPTIONAL = false
        }
      }
    }
  }

  on_price_source_change(id, value, rowindex, actualValue) {
    this.currentrowindex = rowindex
    CommonData.made_changes = true;
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {

        this.fbom.CheckValidPriceListEntered(this.feature_bom_table[i].type_value, value).subscribe(
          data => {

            if (data != undefined && data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                CommonData.made_changes = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.route, 'Sessionout');
                return;
              }
            }

            if (data === "False") {
              actualValue.value = "";
              this.CommonService.show_notification(this.language.InvalidPriceId, 'error');
              return;
            }
            else if (data != null) {
              this.feature_bom_table[i].price_source_id = data
              this.feature_bom_table[i].price_source = value
              this.lookupfor = ""
            }

          }, error => {
            this.showLookupLoader = false;
            if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
              this.CommonService.isUnauthorized();
            }
            return
          })


      }
    }
  }

  onDeleteClick() {
    //var result = confirm(this.language.DeleteConfimation);
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }

  //delete record 
  delete_record() {
    this.GetItemData = []
    this.GetItemData.push({
      CompanyDBId: sessionStorage.selectedComp,
      FeatureId: this.feature_bom_data.feature_id,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.fbom.DeleteData(this.GetItemData).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        console.log(data);
        if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
          //  this.toastr.error('', this.language.Refrence + ' at: ' + data[0].FeatureCode, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.Refrence + ' at: ' + data[0].FeatureCode, 'error');
        }
        else if (data[0].IsDeleted == "1") {
          // this.toastr.success('', this.language.DataDeleteSuccesfully  + ' : ' + data[0].FeatureCode, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.DataDeleteSuccesfully + ' : ' + data[0].FeatureCode, 'success');
          CommonData.made_changes = false;
          this.router.navigateByUrl('feature-bom/view');
        }
        else {
          // this.toastr.error('', this.language.DataNotDelete + ' : ' + data[0].FeatureCode, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.DataNotDelete + ' : ' + data[0].FeatureCode, 'error');
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return
      }
    )
  }


  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      this.delete_record();
    }
    this.show_dialog = false;
  }


  //THis will get the BOMs associated to selected feature id
  onAssociatedBOMClick() {
    if (this.feature_bom_data.feature_id != undefined) {
      this.showLookupLoader = true;
      this.fbom.ViewAssosciatedBOM(this.feature_bom_data.feature_id).subscribe(
        data => {
          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                CommonData.made_changes = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.route, 'Sessionout');
                this.showLookupLoader = false;
                return;
              }

              this.serviceData = data;
              this.lookupfor = 'associated_BOM';
              this.showLookupLoader = false;
              this.inputTitle = this.feature_bom_data.feature_code;
            }
            else {
              // this.toastr.error('', this.language.no_assocaited_bom_with_feature + " : " + this.feature_bom_data.feature_code, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.no_assocaited_bom_with_feature + " : " + this.feature_bom_data.feature_code, 'error');
              this.showLookupLoader = false;
              return;
            }
          }
          else {
            // this.toastr.error('', this.language.no_assocaited_bom_with_feature + " : " + this.feature_bom_data.feature_code, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.no_assocaited_bom_with_feature + " : " + this.feature_bom_data.feature_code, 'error');
            this.showLookupLoader = false;
            return;
          }
        },
        error => {
          this.showLookupLoader = false;
          if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
            this.CommonService.isUnauthorized();
          } else {
            // this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.server_error, 'error');
          }
          return;
        }
      )
    }
    else {
      // this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      this.CommonService.show_notification(this.language.FeatureCodeBlank, 'error');
      this.showLoader = false;
      return;
    }
  }

  onExplodeClick(type) {
    if (type == "manual") {
      this.showtree();
    }
    if (this.feature_bom_data.feature_id != undefined) {
      //now call bom id
      if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
        this.fbom.GetDataForExplodeViewForFeatureBOM(this.companyName, this.feature_bom_data.feature_id, this.feature_bom_data.feature_name).subscribe(
          data => {
            if (data != null && data != undefined) {

              if (data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  CommonData.made_changes = false;
                  this.CommonService.RemoveLoggedInUser().subscribe();
                  this.CommonService.signOut(this.route, 'Sessionout');
                  return;
                }
              }
              let counter_temp = 0;
              let temp_data = data.filter(function (obj) {
                obj['tree_index'] = (counter_temp);
                obj['live_row_id'] = (counter_temp++);
                return obj;
              });
              this.tree_data_json = temp_data;
              this.data1 = this.unflatten(temp_data);
              console.log(this.data1);
            }
            else {
            }

          },
          error => {
            if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
              this.CommonService.isUnauthorized();
            } else {
              // this.toastr.error('', this.language.server_error, this.commonData.toast_config);
              this.CommonService.show_notification(this.language.server_error, 'error');
            }
            return;
          }
        );
      } else {

        for (let i = 0; i < this.feature_bom_table.length; ++i) {
          if (this.feature_bom_table[i].display_name == '') {
            let currentrowindx = i + 1;
            //  this.toastr.error('', this.language.DisplayNameRequired + currentrowindx, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.DisplayNameRequired + currentrowindx, 'error');
          }
        }

        let temp_data_level = this.tree_data_json.filter(function (obj) {
          return obj.level == "0" || obj.level == "1";
        });

        let sequence_count = parseInt(this.tree_data_json.length + 1);
        console.log(this.live_tree_view_data);
        if (this.live_tree_view_data.length > 0) {

          //for (var key in this.live_tree_view_data) {
          for (var key = 0; key < this.live_tree_view_data.length; key++) {
            var update_index = "";

            if (this.live_tree_view_data[key].tree_index !== undefined) {
              let local_tree_index = this.live_tree_view_data[key].tree_index;
              update_index = temp_data_level.findIndex(function (tree_el) {
                return tree_el.tree_index == local_tree_index
              });
            }

            let temp_seq = {};

            if (update_index == "-1") {
              temp_seq = { "sequence": sequence_count, "parentId": this.feature_bom_data.feature_name, "parentNumber": this.feature_bom_data.feature_id, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index, "branchType": this.live_tree_view_data[key].branchType, "icon": this.live_tree_view_data[key].icon, "modalImage": "" };
              this.tree_data_json.push(temp_seq);
              temp_data_level.push(temp_seq);
            } else {

              let TempBranchType = temp_data_level[update_index].branchType;
              let TempIcon = temp_data_level[update_index].icon;
              temp_seq = { "sequence": sequence_count, "parentId": this.feature_bom_data.feature_name, "parentNumber": this.feature_bom_data.feature_id, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index, "branchType": TempBranchType, "icon": TempIcon, "modalImage": "" };

              let up_index = this.tree_data_json.findIndex(function (tree_el) {
                return tree_el.component == temp_data_level[update_index].component && tree_el.parentId == temp_data_level[update_index].parentId && tree_el.branchType == temp_data_level[update_index].branchType
              });
              this.tree_data_json[up_index] = (temp_seq);
              temp_data_level[update_index] = (temp_seq);
            }
          }
          console.log(this.tree_data_json);
          this.live_tree_view_data = [];
        }
      }
    }
    else {
      // this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      this.CommonService.show_notification(this.language.FeatureCodeBlank, 'error');
      return;
    }

  }
  public data1: any[] = [];
  public unflatten(arr) {
    let tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.unique_key] = arrElem;
      mappedArr[arrElem.unique_key]['children'] = [];
    }


    for (let unique_key in mappedArr) {
      if (mappedArr.hasOwnProperty(unique_key)) {
        mappedElem = mappedArr[unique_key];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.node_id) {
          mappedArr[mappedElem['node_id']]['children'].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  onFeatureIdChange() {
    CommonData.made_changes = true;
    this.fbom.onFeatureIdChange(this.feature_bom_data.feature_code).subscribe(
      data => {
        console.log(data);

        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }

        if (data === "False") {
          //  this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.InvalidFeatureId, 'error');
          this.feature_bom_data.feature_id = "";
          this.feature_bom_data.feature_code = "";
          this.feature_bom_data.feature_name = "";
          this.feature_bom_data.OPTM_MODELLEVEL_DESC = false;
          this.feature_bom_data.feature_desc = "";
          this.feature_bom_data.is_accessory = "N";
          this.feature_bom_data.multi_select = 'false';
          this.feature_bom_data.custview_select = 'false';
          this.feature_bom_data.multi_select_disabled = true;
          this.feature_bom_data.feature_min_selectable = 1;
          this.feature_bom_data.feature_max_selectable = 1;
          return;
        }
        else {
          this.lookupfor = 'feature_lookup';
          this.feature_bom_data.feature_id = data;
          this.getFeatureDetails(this.feature_bom_data.feature_id, "Header", 0);
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  //To chk the conflictions of the feature id (hierariechal cylic dependency)
  checkFeaturesAlreadyAddedinParent(enteredFeatureID, feature_type, rowindex, fromEvent) {

    this.fbom.checkFeaturesAlreadyAddedinParent(enteredFeatureID, this.feature_bom_data.feature_id).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          //If exists then will restrict user 
          if (data == "Exist") {
            // this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
            this.CommonService.show_notification(this.language.cyclic_ref_restriction, 'error');
            this.feature_bom_table[rowindex].type_value = "";
            this.feature_bom_table[rowindex].display_name = "";
            return;
          }
          else if (data == "True") {

            if (fromEvent == "lookup") {
              //this.getFeatureDetails(enteredFeatureID, "Header", 0);
              this.getFeatureDetails(enteredFeatureID, "Header", rowindex);
            }
            else if (fromEvent == "change") {
              this.lookupfor = 'feature_Detail_lookup';
              this.getFeatureDetails(feature_type, "Header", rowindex);
            }

          }
        }
        else {
          //  this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.server_error, 'error');
          console.log("Failed when checking hierac check for feature ID")
          return;
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          // this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          this.CommonService.show_notification(this.language.server_error, 'error');
        }
        return;
      }
    )
  }


  //This will recurse the tree
  get_childrens(unique_key) {
    let data = this.complete_dataset.filter(function (obj) {
      return obj['node_id'] == unique_key;
    });
    return data;
  }

  check_component_exist(unique_key, level) {
    level = (parseInt(level) + 1);
    console.log("check_component_exist", unique_key);
    let data = [];
    if (unique_key != "" && unique_key != null && unique_key != undefined) {
      data = this.tree_data_json.filter(function (obj) {
        return obj['node_id'] == unique_key; //  && obj['level'] == level;
      });
    }
    return data;
  }


  toggleTree(e) {
    let element = document.getElementById('right-tree-section');
    if (element.classList.contains('d-block')) {
      this.hidetree();
    } else {
      this.showtree();
    }
  }

  showtree() {
    if (document.getElementById('right-tree-section').classList.contains("d-none")) {
      document.getElementById('right-tree-section').classList.remove("d-none");
      document.getElementById('right-tree-section').classList.add("d-block")
      document.getElementById('left-table-section').classList.remove("col-md-12");
      document.getElementById('left-table-section').classList.add("col-md-9");
    }
  }


  hidetree() {
    if (document.getElementById('right-tree-section').classList.contains("d-block")) {
      document.getElementById('right-tree-section').classList.add("d-none");
      document.getElementById('right-tree-section').classList.remove("d-block")
      document.getElementById('left-table-section').classList.add("col-md-12");
      document.getElementById('left-table-section').classList.remove("col-md-9");
    }
  }
  // openModal(template: TemplateRef<any>) {
  //   $('body').click()
  //   this.modalRef = this.modalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  // }

  childExpand(id: any) {
    id.classList.toggle("expanded")
    if (id.parentNode.parentNode.childNodes[4].classList.contains("d-none")) {
      id.parentNode.parentNode.childNodes[4].classList.remove("d-none");
      id.parentNode.parentNode.childNodes[4].classList.add("d-block");
    } else {
      id.parentNode.parentNode.childNodes[4].classList.remove("d-block");
      id.parentNode.parentNode.childNodes[4].classList.add("d-none");
    }
  }

  getAllId(arr, key) {
    arr.forEach(item => {
      for (let keys in item) {
        if (keys === key) {
          this.expandedKeys.push(item[key])
        } else if (Array.isArray(item[keys])) {
          this.getAllId(item[keys], key);
        }
      }
    });
  }

  expandAll() {
    this.expandedKeys = [];
    this.getAllId(this.data1, 'unique_key');
  }


  collapseAll() {
    this.expandedKeys = [];
  }

  resequence_operation(type) {  // type = 1 : up & type = 2 : down

    CommonData.made_changes = true;
    let row_c_select = this.current_selected_row.rowindex;
    let current_row_index = this.feature_bom_table.findIndex(function (obj) {
      return obj.rowindex == row_c_select;
    });
    this.row_selection = [];
    console.log("this.row_selection start  - ", this.row_selection);
    if (type == '1') {
      let prev_row_index = current_row_index - 1;
      if (this.feature_bom_table[prev_row_index] != undefined) { // && this.feature_bom_table[prev_row_index].length > 0
        this.feature_bom_table[current_row_index].rowindex = this.feature_bom_table[current_row_index].rowindex - 1;
        this.feature_bom_table[prev_row_index].rowindex = this.feature_bom_table[prev_row_index].rowindex + 1;

        var temp_swap = this.feature_bom_table[current_row_index];
        this.feature_bom_table[current_row_index] = this.feature_bom_table[prev_row_index];
        this.feature_bom_table[prev_row_index] = temp_swap;
        this.row_selection = [this.feature_bom_table[prev_row_index].rowindex];
        this.current_selected_row = this.feature_bom_table[prev_row_index];
      }
    } else if (type == '2') {
      let next_row_index = current_row_index + 1;
      if (this.feature_bom_table[next_row_index] != undefined) { // && this.feature_bom_table[next_row_index].length > 0
        this.feature_bom_table[current_row_index].rowindex = this.feature_bom_table[current_row_index].rowindex + 1;
        this.feature_bom_table[next_row_index].rowindex = this.feature_bom_table[next_row_index].rowindex - 1;


        var temp_swap = this.feature_bom_table[current_row_index];
        this.feature_bom_table[current_row_index] = this.feature_bom_table[next_row_index];
        this.feature_bom_table[next_row_index] = temp_swap;
        this.row_selection = [this.feature_bom_table[next_row_index].rowindex];
        this.current_selected_row = this.feature_bom_table[next_row_index];
      }
    }
  }



}
