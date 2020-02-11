import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonData, ColumnSetting } from 'src/app/core/data/CommonData';
import { RoutingService } from 'src/app/core/service/routing.service';
import { CommonService } from 'src/app/core/service/common.service';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ModelbomService } from 'src/app/core/service/modelbom.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();

  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  popup_title = '';

  public dialogOpened = false;
  public isDraggable: boolean = true;
  public current_popup_row: any = "";
  public is_operation_popup_lookup_open: boolean = false;
  public resourceServiceData: any = [];
  public popup_resource: boolean = false;
  public skip: number = 0;
  public popup_lookupfor = "";
  public showLookupLoader: boolean = false;
  public showLoader: boolean = false;
  public LookupDataLoaded: boolean = false;
  public RuleOutputLookupDataLoaded: boolean = false;
  public show_associate_bom_popup: boolean = false;
  public showruleOutputLoader: boolean = false;
  public lookup_key = "";
  public item_code_columns;
  public model_template_item_columns;
  public fill_input_id = '';
  public preview_image = "";
  public dataBind: any = [];
  public outputServiceData: any = [];
  public resource_counter = 0;
  public about_info = [];
  public search_string = "";
  public table_head: ColumnSetting[] = [];
  public table_head_hidden_elements = [];
  public width_value = '100%';
  public allowUnsort = true;
  public sort: SortDescriptor[];
  public gridView: GridDataResult;
  public checked_rules = [];
  public rule_selection_show: boolean = false;
  public rule_output_table_head = [];
  public rule_output_table_head_hidden_elements = [];
  public rule_output_data_loaded:boolean = false;
  public rule_output_title: any;

  constructor(
    private rs: RoutingService,
    private CommonService: CommonService,
    private router: Router,
    private mbom: ModelbomService, 

  ) { }

  ngOnInit() {
  }

  async ngOnChanges(): Promise<void> {
    this.popup_lookupfor = this.lookupfor;
    this.show_associate_bom_popup = false;
    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.showruleOutputLoader = true;
    this.RuleOutputLookupDataLoaded = false;
    this.lookup_key = '';
    this.item_code_columns = [];
    this.model_template_item_columns = [];
    this.fill_input_id = '';
    this.preview_image = '';
    this.dataBind = [];
    this.outputServiceData = [];
    this.skip = 0;
    this.resource_counter = 0;
    this.dialogOpened = false;
    this.about_info = [];
    this.rule_selection_show = false;
    this.rule_output_data_loaded = false;

    this.current_popup_row = "";
    //this.test_model();
    //    console.log("this.lookupfor " + this.popup_lookupfor);
    this.search_string = "";
    // if (this.popup_lookupfor == "output_invoice_print") {
    //   await this.sleep(400);
    // }

    if (this.popup_lookupfor != "") {
      if (this.popup_lookupfor == "model_template") {
        this.model_template_lookup();
        return;
      }

      if (this.popup_lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
        return;
      }

      if (this.popup_lookupfor == "feature_lookup") {
        this.get_features_lookup();
        return;
      }

      if (this.popup_lookupfor == "feature_Detail_lookup") {
        this.get_features_lookup();
        return;
      }

      if (this.popup_lookupfor == "Item_Detail_lookup") {
        this.get_Item_lookup();
        return;
      }

 

      if (this.popup_lookupfor == "ModelBom_lookup" || this.popup_lookupfor == "ModelBom_Detail_lookup") {
        this.get_Model_lookup();
        return;
      }

    //   if (this.popup_lookupfor == "large_image_view") {
    //     this.showImage();
    //     return;
    //   }
      if (this.popup_lookupfor == "Price_lookup") {
        this.get_Price_lookup();
        return;
      }
      if (this.popup_lookupfor == "rule_section_lookup") {
        this.ruleSelection();
        return;
      }

    //   if (this.popup_lookupfor == "tree_view__model_bom_lookup") {
    //     this.showModelBOMTreeView();
    //     return;
    //   }

      if (this.popup_lookupfor == "associated_BOM") {
        this.showAssociatedBOMs();
        return;
      }
    //   if (this.popup_lookupfor == "feature_Detail_Output_lookup") {
    //     this.get_features_Output_lookup();
    //     return;
    //   }

    if (this.popup_lookupfor == "output_customer") {
      this.customer_lookup();
      return;
    }

    if (this.popup_lookupfor == "operand_feature_lookup") {
      this.get_operand_lookup();
      return;
    }

    if (this.popup_lookupfor == "operand_model_lookup") {
      this.get_Model_lookup();
      return;
    }

    if (this.popup_lookupfor == "configure_list_lookup") {
      this.configure_list_lookup();
      return;
    }
    if (this.popup_lookupfor == "ModelBomForWizard_lookup") {
      this.get_ModelWizard_lookup();
      return;
    }

    // if (this.popup_lookupfor == "output_invoice_print") {
    //   this.output_invoice_print();
    //   return;
    // }

    // if (this.popup_lookupfor == 'routing_resource_lookup') {
    //     this.routing_resource_lookup();
    //     return;
    //   }

      if (this.popup_lookupfor == "warehouse_lookup") {
        this.warehouse_lookup_list();
      }

    //   if (this.popup_lookupfor == 'operation_lookup') {
    //     this.operation_lookup_list();
    //   }

    //   if (this.popup_lookupfor == 'workcenter_lookup') {
    //     this.workcenter_lookup_list();
    //   }

    //   if (this.popup_lookupfor == "template_routing_lookup") {
    //     this.template_routing_list();
    //   }

    //   if(this.popup_lookupfor == "help_popup"){

    //     this.show_help_popup();
    //   }

     }
  }

  private loadServerData(dataset): void {
    if (this.sort !== undefined && this.sort !== null) {
      this.gridView = {
        data: orderBy(dataset, this.sort),
        total: this.serviceData.length
      };
    } else {
      this.gridView = {
        data: dataset,
        total: this.serviceData.length
      };
    }
  }

  customer_lookup() {
    this.popup_title = this.language.customer;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = [
      {
        field: 'CustID',
        title: this.language.customer_code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'Name',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
    ];
    this.table_head_hidden_elements = [false, false];
    this.lookup_key = 'Name';
    this.width_value = ((100 / this.table_head.length) + '%');
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }
  }

  configure_list_lookup() {
    this.popup_title = this.language.list_configuration;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'modify_duplicate_lookup';
    this.table_head = [
      {
        field: 'OPTM_LOGID',
        title: this.language.configuration_id,
        type: 'numeric',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DESC',
        title: this.language.description,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_BPCODE',
        title: this.language.customer,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_CONTACTPERSON',
        title: this.language.contact_person,
        type: 'text',
        width: '100',
        attrType: 'text'
      }
    ];

    this.lookup_key = 'OPTM_DESC';
    this.width_value = ((100 / this.table_head.length) + '%');
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }
  }

  get_ModelWizard_lookup() {
    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = [
      {
        field: 'OPTM_FEATURECODE',
        title: this.language.code,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_DISPLAYNAME',
        title: this.language.Name,
        type: 'text',
        width: '100',
        attrType: 'text'
      },
    ];
    this.table_head_hidden_elements = [true, false, false, true, true];
    this.width_value = ((100 / this.table_head.length) + '%');
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  get_Price_lookup() {
    this.popup_title = this.language.price_source;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'price_source';
    this.lookup_key = 'PriceListID';
    // this.table_head = [this.language.price_source, this.language.price_list_name];

    console.log(this.serviceData);
    this.table_head = [
    {
      field: 'PriceListID',
      title: this.language.price_source,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'ListName',
      title: this.language.price_list_name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];
    this.table_head_hidden_elements = [false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
        // $("#lookup_modal").modal('show');
      }
    }
  }

  showAssociatedBOMs() {

    this.popup_title = this.language.associated_BOM;
    this.LookupDataLoaded = false;
    this.showLoader = true;

    console.log(this.serviceData);
    this.table_head = [

    {
      field: 'DisplayName',
      title: this.language.Model_Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'Description',
      title: this.language.Model_Desc,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    ];
    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        // $("#simple_table_modal").modal('show');
        this.show_associate_bom_popup = true;
        this.dialogOpened = false;
      }
    }

  }

  get_features_lookup() {


    this.popup_title = this.language.Bom_FeatureId;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    // this.table_head = [this.language.Id, this.language.code, this.language.Name];

    this.table_head = [
    {
      field: 'OPTM_FEATURECODE',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'OPTM_DISPLAYNAME',
      title: this.language.Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    }
    ];

    if(this.lookupfor == "feature_lookup") {
      this.table_head.push({
        field: 'OPTM_ACCESSORY',
        title: this.language.Model_Accessory,
        type: 'text',
        width: '100',
        attrType: 'text'
      });
    }

    if (this.serviceData !== undefined ) {
      if(this.serviceData[0]!= undefined && this.serviceData[0].Accessory !== undefined){
        var objj = this;
        var language = this.language;
        this.serviceData = this.serviceData.filter(function(obj){
          if(obj.Accessory == 'N'){
            obj.Accessory = language.NO;
          } else if(obj.Accessory == 'Y'){
            obj.Accessory = language.YES;
          }
          return obj;
        });
        if(this.lookupfor == "feature_Detail_lookup") {
          this.table_head.push({
            field: 'Accessory',
            title: this.language.Model_Accessory,
            type: 'text',
            width: '100',
            attrType: 'text'
          });
        }
        
      }
    }

    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }

  }
  warehouse_lookup_list() {

    this.popup_title = this.language.warehouse;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'warehouseCode';
    this.table_head = [this.language.code, this.language.Name];
    this.table_head = [
    {
      field: 'WHSECODE',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'Description',
      title: this.language.description,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];
    this.table_head_hidden_elements = [false, false];
    this.lookup_key = 'Name';
    this.width_value = ((100 / this.table_head.length) + '%');
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
        // $("#lookup_modal").modal('show');
      }
    }
  }

  ruleSelection() {
    this.popup_title = this.language.rule_selection;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.lookup_key = 'code';
    this.table_head = [this.language.select, this.language.rule, this.language.description];
    console.log(this.serviceData);

    this.table_head_hidden_elements = [false, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.checked_rules = [];
        for (var i = 0; i < this.serviceData.length; i++) {
          if (this.serviceData[i].Selected == "Y") {
            this.serviceData[i].Selected = true;
            this.checked_rules.push(this.serviceData[i]);
          }
          else {
            this.serviceData[i].Selected = false;
          }

        }
        this.rule_selection_show = true;
      }
    }
  }

  get_rule_output(rule_id, seq_id) {
    this.rule_output_title = this.language.rule_output_title;
    this.showruleOutputLoader = true;
    this.RuleOutputLookupDataLoaded = false;
    this.rule_output_table_head = ['#', this.language.feature, this.language.description];
    this.rule_output_table_head_hidden_elements = [false, false, false];
    this.rule_output_data_loaded = true;
     
    let obj = this;
    this.mbom.getRuleOutput(rule_id, seq_id).subscribe(
      data => {
        console.log(data);
        if (data !== '' && data !== undefined && data !== null) {
          obj.outputServiceData = data
        } else {
         this.CommonService.show_notification(this.language.incorrectfile, 'error');
        }

      }, error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.CommonService.isUnauthorized();
        }
      })

    this.showruleOutputLoader = false;
    this.RuleOutputLookupDataLoaded = true;

  }
  
  close_rule_window() {
    this.rule_output_data_loaded = false; 
  }

  on_checkbox_checked(checkedvalue, row_data) {
   
    if (checkedvalue == true) {
      row_data.Selected = true;
      this.checked_rules.push(row_data);
    }
    else {
      let i = this.checked_rules.indexOf(row_data);
      row_data.Selected = false;
      this.checked_rules.splice(i, 1)
    }
  
  }
  rule_select_ok() {
    this.lookupvalue.emit(this.checked_rules);
    this.close_kendo_dialog();
  }
  model_item_generation_lookup() {
    this.popup_title = this.language.Model_Ref;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemCode';
    
    this.table_head = [
    {
      field: 'OPTM_CODE',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];

    this.table_head_hidden_elements = [false];
    this.lookup_key = 'OPTM_CODE';
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
        // $("#lookup_modal").modal('show');
      }
    }
  }

  model_template_lookup() {
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = [this.language.code, this.language.Name];

    this.table_head = [
    {
      field: 'Code',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'Name',
      title: this.language.Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];


    this.table_head_hidden_elements = [false, false];
    this.lookup_key = 'Name';

    this.width_value = ((100 / this.table_head.length) + '%');


    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }
  }

  get_operand_lookup() {


    this.popup_title = this.language.Bom_FeatureId;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = [
    {
      field: 'feature_code',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'OPTM_DISPLAYNAME',
      title: this.language.Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];

    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }

  }  

  get_Model_lookup() {


    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = [
    {
      field: 'OPTM_FEATURECODE',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'OPTM_DISPLAYNAME',
      title: this.language.Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },

    ];


    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }

  }

  get_Item_lookup() {


    this.popup_title = this.language.ItemLookupTitle;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'type_value';
    this.lookup_key = 'ItemKey';
    // this.table_head = [this.language.itemkey, this.language.Name];

    this.table_head = [
    {
      field: 'ItemKey',
      title: this.language.code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'Description',
      title: this.language.Name,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    ];

    this.table_head_hidden_elements = [false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    console.log('this.serviceData');
    console.log(this.serviceData);
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
        this.loadServerData(this.serviceData);
      }
    }

  }

  on_item_select(selection) {
    var lookup_key = selection.selectedRows[0].dataItem;
    if (this.is_operation_popup_lookup_open == true) {
      if (lookup_key.ResCode != undefined && lookup_key.Name != undefined) {
        for (let i = 0; i < this.resourceServiceData.length; ++i) {
          if (this.resourceServiceData[i].rowindex === this.current_popup_row) {
            this.resourceServiceData[i].resource_code = lookup_key.ResCode;
            this.resourceServiceData[i].resource_name = lookup_key.Name;
            this.resourceServiceData[i].resource_uom = lookup_key.UnitOfMsr;
            this.resourceServiceData[i].resource_uom = lookup_key.UnitOfMsr;
            this.resourceServiceData[i].DCNum = lookup_key.DCNum;
            this.get_consumption_inverse_value('consumption', 1, this.resourceServiceData[i].resource_code, i);
          }
        }
      }
    }

    if (this.popup_resource == false) {
      this.lookupvalue.emit(Object.values(lookup_key));
    }

    if (this.popup_resource == true) {
      this.popup_resource = false;
    }
    this.serviceData = [];
    selection.selectedRows = [];
    selection.index = 0;
    selection.selected = false;
    this.skip = 0;
    this.dialogOpened = false;
    if (this.is_operation_popup_lookup_open == false) {
      this.current_popup_row = "";
    }
    setTimeout(() => {
      this.popup_lookupfor = "";
    }, 10);
  }

  get_consumption_inverse_value(type, value, resource_code, currentrow) {
    this.rs.getResConversionInverse(type, value, resource_code).subscribe(
      data => {
        console.log(data);
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.router, 'Sessionout');
              this.showLookupLoader = false;
              return;
            }
            if (type == 'inverse') {
              this.resourceServiceData[currentrow].resource_consumption = parseFloat(data[0].Consumption).toFixed(3)
            }
            if (type == 'consumption') {
              this.resourceServiceData[currentrow].resource_inverse = parseFloat(data[0].Inverse).toFixed(3);
            }
            if (data[0].TimeUOM != null && data[0].TimeUOM != undefined && data[0].TimeUOM != "") {
              this.resourceServiceData[currentrow].time_uom = data[0].TimeUOM;
            } else {
              this.resourceServiceData[currentrow].time_uom = "";
            }
            if (data[0].TimeConsumption != null && data[0].TimeConsumption != undefined) {
              this.resourceServiceData[currentrow].time_consumption = parseFloat(data[0].TimeConsumption).toFixed(3);
            } else {
              this.resourceServiceData[currentrow].time_consumption = (0).toFixed(3);
            }
            if (data[0].TimeInverse != null && data[0].TimeInverse != undefined) {
              this.resourceServiceData[currentrow].time_inverse = parseFloat(data[0].TimeInverse).toFixed(3);
            } else {
              this.resourceServiceData[currentrow].time_consumption = (0).toFixed(3);
            }
          }
        } else {
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
        }
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        } else {
          this.CommonService.show_notification(this.language.server_error, 'error');
        }
      }
    )
  }

  public close_kendo_dialog() {
    this.dialogOpened = false;
    this.current_popup_row = "";
    this.show_associate_bom_popup = false;
    this.rule_selection_show = false;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadServerData(this.serviceData);
  }

}
