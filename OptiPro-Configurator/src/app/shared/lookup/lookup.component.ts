import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonData, ColumnSetting } from 'src/app/core/data/CommonData';
import { RoutingService } from 'src/app/core/service/routing.service';
import { CommonService } from 'src/app/core/service/common.service';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ModelbomService } from 'src/app/core/service/modelbom.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FeaturebomService } from 'src/app/core/service/featurebom.service';
import { FeaturemodelService } from 'src/app/core/service/featuremodel.service';

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
  @Output() lookupvalues = new EventEmitter();


  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  popup_title = '';
  public defaultCurrency = sessionStorage.defaultCurrency;
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
  public routing_resource_show: boolean = false;
  public rule_output_table_head = [];
  public rule_output_table_head_hidden_elements = [];
  public rule_output_data_loaded:boolean = false;
  public rule_output_title: any;
  public resource_popup_title = '';

  public resource_basisdd: any[];
  public resourceServiceOper: any = "";
  public resourceServiceOperCM: any = "";
  public resourceServiceWc: any = "";
  public windowTop: number = 50;
  public windowLeft: number = 50;
  public imageDialogOpened: boolean = false;
  public enlargeImage: any;
  public reportDialogOpened: boolean = false;
  public reportBase64String:any;
  public isColumnFilter: boolean = false;
  public isColumnFilter1: boolean = false;
  public attributeServiceData: any = [];
  public attributeMasterServiceData: any = [];
  public attribute_popup_title = '';
  public add_atttribute_show: boolean = false;
  public add_atttribute_master: boolean = false;  
  public is_attribute_popup_lookup_open: boolean = false;
  public is_attribute_master_popup_lookup_open: boolean = false;
  public popup_attribute: boolean = false;
  public attribute_counter = 0;
  public attribute_master_counter = 0;
  public detail_select_options: any = '';
  public itemRowIndex = '';
  public itemFeatureId = '';
  public viewAttributeDialogOpened = false;
  public viewAttributeList: any = [];
  public viewAttributeColumn: any = [];
  public viewDialogWidth = 400;
;  constructor(
    private rs: RoutingService,
    private fbom: FeaturebomService,
    private CommonService: CommonService,
    private router: Router,
    private mbom: ModelbomService, 
    private fms: FeaturemodelService
  ) { 
  }

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
    this.routing_resource_show = false
    this.reportDialogOpened = false;
    

    this.current_popup_row = "";
    //this.test_model();
    //    console.log("this.lookupfor " + this.popup_lookupfor);
    this.search_string = "";
    // if (this.popup_lookupfor == "output_invoice_print") {
    //   await this.sleep(400);
    // }

    if (this.popup_lookupfor != "") {
      if (this.popup_lookupfor == "model_template") {
        console.log(this.serviceData);
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

       if (this.popup_lookupfor == "large_image_view") {
         console.log('hello');
         console.log(this.selectedImage);
         this.showImage();
         return;
       }

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
    if (this.popup_lookupfor == "Attribute_lookup") {
      this.get_attribute_lookup();
      return;
    }
    if (this.popup_lookupfor == "ModelBomForWizard_lookup") {
      this.get_ModelWizard_lookup();
      return;
    }

    if (this.popup_lookupfor == "output_invoice_print_new") {
      this.output_invoice_print_new();
      return;
    }

    // if (this.popup_lookupfor == "output_invoice_print") {
    //   this.output_invoice_print();
    //   return;
    // }
    if (this.popup_lookupfor == 'routing_resource_lookup') {
      this.routing_resource_lookup();
      return;
    }
    if (this.popup_lookupfor == 'add_attribute_lookup') {
        this.add_atttribute_lookup();
        return;
      }
      if (this.popup_lookupfor == 'customeview_lookup') {
        this.customeview_lookup();
        return;
      }
      if (this.popup_lookupfor == 'add_attribute_master_lookup') {
        this.add_atttribute_master_lookup();
        return;
      }
      if (this.popup_lookupfor == 'view_attribute_lookup') {
        this.get_view_attribute_lookup();
        return;
      }

      

      if (this.popup_lookupfor == "warehouse_lookup") {
        this.warehouse_lookup_list();
      }

      if (this.popup_lookupfor == 'operation_lookup') {
        this.operation_lookup_list();
      }

    //   if (this.popup_lookupfor == 'workcenter_lookup') {
    //     this.workcenter_lookup_list();
    //   }

      if (this.popup_lookupfor == "template_routing_lookup") {
        this.template_routing_list();
      }

    //   if(this.popup_lookupfor == "help_popup"){

    //     this.show_help_popup();
    //   }

     }
  }

  output_invoice_print_new(){
    this.popup_title = this.language.print_quote;
    this.reportBase64String= "data:application/pdf;base64,"+ this.serviceData; 
    console.log("this", this.reportBase64String);
    if(this.reportBase64String!=null && this.reportBase64String != "")  { 
      this.reportDialogOpened = true; 
    }
  }

  operation_lookup_list() {
    this.popup_title = this.language.operation;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'OperationCode';
    this.table_head = [this.language.code, this.language.Name];

    this.table_head = [
    {
      field: 'OPRCode',
      title: this.language.operation_no,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'OperationCode',
      title: this.language.operation_code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'OPRDesc',
      title: this.language.description,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'operTypeStr',
      title: this.language.operation_type,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'WCCode',
      title: this.language.workcenter_code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'Description',
      title: this.language.workcenter_desc,
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

  template_routing_list() {
    this.popup_title = this.language.template_routing;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'template_routing';
    this.table_head = [this.language.code, this.language.Name];

    this.table_head = [
    {
      field: 'ITEMCODE',
      title: this.language.item_code,
      type: 'text',
      width: '100',
      attrType: 'text'
    },
    {
      field: 'ItemName',
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

  private loadServerData(dataset): void {
    if (this.sort !== undefined && this.sort !== null) {
      this.gridView = {
        data: orderBy(dataset, this.sort),
        total: dataset.length
      };
    } else {
      this.gridView = {
        data: dataset,
        total: dataset.length
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

  get_attribute_lookup() {
    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = [
      {
        field: 'OPTM_ATTR_NAME',
        title: 'Attribute Name',
        type: 'text',
        width: '100',
        attrType: 'text'
      },
      {
        field: 'OPTM_VALUE',
        title: 'Attribute Value',
        type: 'text',
        width: '100',
        attrType: 'number'
      },
    ];
    this.table_head_hidden_elements = [true, false, false, true, true];
    this.width_value = ((100 / this.table_head.length) + '%');
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      this.dialogOpened = true;
      // if (this.serviceData.length > 0) {
      //   this.dialogOpened = true;
      // }
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
      title: this.language.Model_Code,
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

    this.table_head_hidden_elements = [false, false];
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

  showImage(){
    this.imageDialogOpened = true;
    this.enlargeImage = this.selectedImage;
  }

  closeImageDialog(){
    this.imageDialogOpened = false;
    this.lookupvalues.emit('');
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

  get_view_attribute_lookup() {
    this.popup_title = this.serviceData.featureName +" "+this.language.attribute;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.viewAttributeList = this.serviceData.attributeList;
    if(this.serviceData.type == "FeatureBom"){
    this.viewDialogWidth = 1200
    this.viewAttributeColumn = this.serviceData.atttributeColumn;
    if(this.viewAttributeColumn.length > 0){
      this.table_head = [];
      this.table_head.push({
        field: 'OPTM_ITEMCODE',
        title: this.serviceData.featureName,
        type: 'text',
        width: '100',
        attrType: 'text'
        });     
      for(var valuesObject in this.viewAttributeColumn) {
      
       this.table_head.push({
        field: this.viewAttributeColumn[valuesObject].OPTM_ATTR_CODE,
        title: this.viewAttributeColumn[valuesObject].OPTM_ATTR_NAME,
        type: 'text',
        width: '100',
        attrType: 'number'
        });
      
       }
      }
   
  } else {
    this.table_head = [
      // {
      //   field: 'OPTM_FEATUREID',
      //   title: this.language.Model_Code,
      //   type: 'text',
      //   width: '100',
      //   attrType: 'text'
      // },
      // {
      //   field: 'OPTM_FEATURECODE',
      //   title: this.language.Model_Name,
      //   type: 'text',
      //   width: '100',
      //   attrType: 'text'
      // },
      // {
      //   field: 'OPTM_ITEM_CODE',
      //   title: this.language.item_code,
      //   type: 'text',
      //   width: '100',
      //   attrType: 'text'
      // },
      // {
      //   field: 'OPTM_ITEM_DISPLAYNAME',
      //   title: this.language.item_name,
      //   type: 'text',
      //   width: '100',
      //   attrType: 'text'
      // },
      // {
      //   field: 'OPTM_ATTR_CODE',
      //   title: this.language.attribute_id,
      //   type: 'text',
      //   width: '120',
      //   attrType: 'text'
      // },
  
      {
        field: 'OPTM_ATTR_NAME',
        title: this.language.Attribute_name,
        type: 'text',
        width: '150',
        attrType: 'text'
      },
      // {
      //   field: 'OPTM_OPTION',
      //   title: this.language.option,
      //   type: 'text',
      //   width: '120',
      //   attrType: 'text'
      // },
  
      // {
      //   field: 'OPTM_OPTION_VALUE',
      //   title: this.language.optionValue,
      //   type: 'text',
      //   width: '150',
      //   attrType: 'text'
      // },
      // {
      //   field: 'OPTM_INPUT',
      //   title: this.language.inputs,
      //   type: 'text',
      //   width: '100',
      //   attrType: 'text'
      // },
      {
        field: 'OPTM_VALUE',
        title: this.language.value,
        type: 'text',
        width: '100',
        attrType: 'number'
      },
      ];
  }


    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.attributeList.length > 0) {
        this.viewAttributeDialogOpened = true;
        this.loadServerData(this.serviceData.attributeList);
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
    if (this.is_attribute_popup_lookup_open == true) {
      if (lookup_key.OPTM_ATTR_CODE != undefined && lookup_key.OPTM_ATTR_NAME != undefined) {
        for (let i = 0; i < this.attributeServiceData.length; ++i) {
          if (this.attributeServiceData[i].rowindex === this.current_popup_row) {
            this.attributeServiceData[i].OPTM_ATTR_CODE = lookup_key.OPTM_ATTR_CODE;
            this.attributeServiceData[i].OPTM_ATTR_NAME = lookup_key.OPTM_ATTR_NAME;
            this.attributeServiceData[i].OPTM_OPTION = lookup_key.OPTM_OPTION;
            this.attributeServiceData[i].OPTM_OPTION_VALUE = lookup_key.OPTM_OPTION_VALUE;
            this.attributeServiceData[i].OPTM_INPUT = lookup_key.OPTM_INPUT;
            this.attributeServiceData[i].OPTM_VALUE = lookup_key.OPTM_VALUE;
        
            
          }
        }
      }
    }
    if (this.is_attribute_master_popup_lookup_open== true) {
      if (lookup_key.OPTM_ATTR_CODE != undefined && lookup_key.OPTM_ATTR_NAME != undefined) {
       
        if(this.attributeMasterServiceData.length > 0){
         var isExist = this.attributeMasterServiceData.filter(function (obj) {
            return  obj.OPTM_ATTR_CODE == lookup_key.OPTM_ATTR_CODE;
          }) 
          if(isExist.length > 0) {
            this.dialogOpened = false;
            this.CommonService.show_notification(this.language.DuplicateId, 'error');
            return;
          }   
        }
        for (let i = 0; i < this.attributeMasterServiceData.length; ++i) {
          if (this.attributeMasterServiceData[i].rowindex === this.current_popup_row) {
            this.attributeMasterServiceData[i].OPTM_ATTR_CODE = lookup_key.OPTM_ATTR_CODE;
            this.attributeMasterServiceData[i].OPTM_ATTR_NAME = lookup_key.OPTM_ATTR_NAME;
            this.attributeMasterServiceData[i].OPTM_OPTION = lookup_key.OPTM_OPTION;
            this.attributeMasterServiceData[i].OPTM_OPTION_VALUE = lookup_key.OPTM_OPTION_VALUE;
            this.attributeMasterServiceData[i].OPTM_INPUT = lookup_key.OPTM_INPUT;
            this.attributeMasterServiceData[i].OPTM_VALUE = lookup_key.OPTM_VALUE;  
            this.attributeMasterServiceData[i].OPTM_FEATUREID = lookup_key.OPTM_FEATUREID;        
            
          }
        }
      }
    }

    if (this.popup_resource == false && this.popup_attribute == false) {
      this.lookupvalue.emit(Object.values(lookup_key));
    }

    if (this.popup_resource == true) {
      this.popup_resource = false;
    }
    if (this.popup_attribute == true) {
      this.popup_attribute = false;
    }
    this.serviceData = [];
    selection.selectedRows = [];
    selection.index = 0;
    selection.selected = false;
    this.skip = 0;
    this.dialogOpened = false;
    if (this.is_operation_popup_lookup_open == false && this.is_attribute_popup_lookup_open == false 
        && this.is_attribute_master_popup_lookup_open == false ) {
      this.current_popup_row = "";
    }
    setTimeout(() => {
      this.popup_lookupfor = "";
    }, 10);
  }
  add_atttribute_master_lookup() {
    this.attribute_popup_title = this.language.attach_attribute;
    this.detail_select_options = this.commonData.option_type();
    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.add_atttribute_master = true;
    this.is_attribute_master_popup_lookup_open = true;
    this.attributeMasterServiceData = [];
    if(this.serviceData.length >0) {
      this.attribute_counter = 0;
      for (var inx = 0; inx < this.serviceData.length; inx++) {
        this.attribute_counter++;       
        this.attributeMasterServiceData.push({      
          rowindex: this.attribute_counter,          
          OPTM_FEATURECODE: this.serviceData[inx]. OPTM_FEATURECODE,
          OPTM_FEATUREID:this.serviceData[inx]. OPTM_FEATUREID,
          OPTM_ATTR_CODE: this.serviceData[inx]. OPTM_ATTR_CODE,
          OPTM_ATTR_NAME: this.serviceData[inx]. OPTM_ATTR_NAME,
          OPTM_OPTION: this.serviceData[inx]. OPTM_OPTION,
          OPTM_OPTION_VALUE: this.serviceData[inx]. OPTM_OPTION_VALUE,     
          OPTM_INPUT: this.serviceData[inx]. OPTM_INPUT,
          OPTM_ATTR_VALUE: this.serviceData[inx]. OPTM_ATTR_VALUE,
          OPTM_VALUE: this.serviceData[inx]. OPTM_VALUE,
          OPTM_SEQ: this.serviceData[inx]. OPTM_SEQ,                
        });
     
      }
    }else{
      this.insert_new_attribute_master();
    }  
    
  }

  customeview_lookup() {
    this.attribute_popup_title = this.language.attach_attribute;
    this.detail_select_options = this.commonData.option_type();
    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.add_atttribute_master = true;
    this.is_attribute_master_popup_lookup_open = true;
    this.attributeMasterServiceData = [];
    if(this.serviceData.length >0) {
      this.attribute_counter = 0;
      for (var inx = 0; inx < this.serviceData.length; inx++) {
        this.attribute_counter++;       
        this.attributeMasterServiceData.push({      
          rowindex: this.attribute_counter,          
          OPTM_FEATURECODE: this.serviceData[inx]. OPTM_FEATURECODE,
          OPTM_FEATUREID:this.serviceData[inx]. OPTM_FEATUREID,
          OPTM_ATTR_CODE: this.serviceData[inx]. OPTM_ATTR_CODE,
          OPTM_ATTR_NAME: this.serviceData[inx]. OPTM_ATTR_NAME,
          OPTM_OPTION: this.serviceData[inx]. OPTM_OPTION,
          OPTM_OPTION_VALUE: this.serviceData[inx]. OPTM_OPTION_VALUE,     
          OPTM_INPUT: this.serviceData[inx]. OPTM_INPUT,
          OPTM_ATTR_VALUE: this.serviceData[inx]. OPTM_ATTR_VALUE,
          OPTM_VALUE: this.serviceData[inx]. OPTM_VALUE,
          OPTM_SEQ: this.serviceData[inx]. OPTM_SEQ,                
        });
     
      }
    }else{
      this.insert_new_attribute_master();
    }  
    
  }
  add_atttribute_lookup() {
    this.attribute_popup_title = this.language.attribute;
    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.add_atttribute_show = true;
    this.is_attribute_popup_lookup_open = true;
    this.itemRowIndex =  this.serviceData.rowindex 
    this.itemFeatureId = this.serviceData.feature_id; 
    this.attributeServiceData = [];
   
    if(this.serviceData.attributeList.length >0){
      this.attribute_counter = 0;
      for (var inx = 0; inx < this.serviceData.attributeList.length; inx++) {
        this.attribute_counter++;
        if(this.serviceData.type == "FeatureBom")
        {
        this.attributeServiceData.push({      
          rowindex: this.attribute_counter,
          OPTM_FEATUREDTLROWID: this.serviceData.rowId,
          OPTM_FEATURECODE: this.serviceData.featureCode,
          OPTM_FEATUREID:this.serviceData.attributeList[inx]. OPTM_FEATUREID,
          OPTM_ATTR_CODE: this.serviceData.attributeList[inx]. OPTM_ATTR_CODE,
          OPTM_ATTR_NAME: this.serviceData.attributeList[inx]. OPTM_ATTR_NAME,
          OPTM_OPTION: this.serviceData.attributeList[inx]. OPTM_OPTION,
          OPTM_OPTION_VALUE: this.serviceData.attributeList[inx]. OPTM_OPTION_VALUE,     
          OPTM_INPUT: this.serviceData.attributeList[inx]. OPTM_INPUT,
          OPTM_ATTR_VALUE: this.serviceData.attributeList[inx]. OPTM_ATTR_VALUE,
          OPTM_VALUE: this.serviceData.attributeList[inx]. OPTM_VALUE,
          OPTM_SEQ: this.serviceData.attributeList[inx]. OPTM_SEQ,
          attribute_desc_disable: true,
          attribute_option_disable: true,         
        });
      }else {
        this.attributeServiceData.push({      
          rowindex: this.attribute_counter,
          OPTM_MODELDTLROWID: this.serviceData.rowId,
          OPTM_MODELCODE: this.serviceData.modelCode,
          OPTM_MODELID:this.serviceData.attributeList[inx]. OPTM_FEATUREID,
          OPTM_ATTR_CODE: this.serviceData.attributeList[inx]. OPTM_ATTR_CODE,
          OPTM_ATTR_NAME: this.serviceData.attributeList[inx]. OPTM_ATTR_NAME,
          OPTM_OPTION: this.serviceData.attributeList[inx]. OPTM_OPTION,
          OPTM_OPTION_VALUE: this.serviceData.attributeList[inx]. OPTM_OPTION_VALUE,     
          OPTM_INPUT: this.serviceData.attributeList[inx]. OPTM_INPUT,
          OPTM_ATTR_VALUE: this.serviceData.attributeList[inx]. OPTM_ATTR_VALUE,
          OPTM_VALUE: this.serviceData.attributeList[inx]. OPTM_VALUE,
          OPTM_SEQ: this.serviceData.attributeList[inx]. OPTM_SEQ,
          attribute_desc_disable: true,
          attribute_option_disable: true,         
        });
      }
      }
    }else{
      this.insert_new_attribute();
    }
    
    
  }

  routing_resource_lookup() {
    this.resource_popup_title = this.language.routing_resource;
    this.LookupDataLoaded = false;
    this.is_operation_popup_lookup_open = true;
    this.showLoader = true;
    this.resourceServiceData = [];
    this.resource_basisdd = this.commonData.resource_basic();
    if (this.serviceData !== undefined && this.serviceData !== "") {
      if (this.serviceData.wc_code != "" && this.serviceData.oper_code != "" && this.serviceData.wc_code != undefined && this.serviceData.oper_code != undefined) {
        for (var inx = 0; inx < this.serviceData.oper_res.length; inx++) {
          console.log("this.serviceData.oper_res[inx] - ", this.serviceData.oper_res[inx]);
          this.resource_counter = 0;
          if (this.resourceServiceData.length > 0) {
            this.resource_counter = this.resourceServiceData.length
          }

          let basis = '1';
          let is_basis_disabled = false;
          if (this.serviceData.oper_res[inx].oper_consumption_method == '1' || this.serviceData.oper_res[inx].oper_consumption_method == 1) { // setup 
            is_basis_disabled = true;
            basis = '4';
            this.resource_basisdd = [
            { "value": '4', "Name": "Setup" }
            ]
          }

          if (this.serviceData.oper_res[inx].oper_consumption_method == '2' || this.serviceData.oper_res[inx].oper_consumption_method == 2) { // variable
            is_basis_disabled = false;
            basis = '1';
            this.resource_basisdd = [
            { "value": '1', "Name": "Item" },
            { "value": '4', "Name": "Setup" }
            ]
          }

          if (this.serviceData.oper_res[inx].oper_consumption_method == '3' || this.serviceData.oper_res[inx].oper_consumption_method == 3) { // Fixed
            is_basis_disabled = false;
            basis = '1';
            this.resource_basisdd = [
            { "value": '1', "Name": "Item" },
            { "value": '2', "Name": "Batch" },
            { "value": '4', "Name": "Setup" }
            ]
          }

          if(this.serviceData.oper_res[inx].basis != undefined && this.serviceData.oper_res[inx].basis !="" && this.serviceData.oper_res[inx].basis != null){
            basis = this.serviceData.oper_res[inx].basis;
          }


          this.resource_counter++;
          var res_consum_type = 1;
          if (this.serviceData.oper_res[inx].resource_consumption_type != undefined && this.serviceData.oper_res[inx].resource_consumption_type != "") {
            res_consum_type = this.serviceData.oper_res[inx].resource_consumption_type;
          } else {
            res_consum_type  = this.serviceData.oper_res[inx].oper_consumption_method;
          }
          if (this.serviceData.oper_res[inx].OPRCode != undefined) {
            this.resourceServiceData.push({
              lineno: this.resource_counter,
              rowindex: this.resource_counter,
              ChrgBasis: this.serviceData.oper_res[inx].ChrgBasis,
              DCNum: this.serviceData.oper_res[inx].DCNum,
              LineID: this.serviceData.oper_res[inx].LineID,
              operation_no: this.serviceData.oper_res[inx].OPRCode,
              oper_type: this.serviceData.oper_res[inx].oper_type,
              oper_consumption_type: this.serviceData.oper_res[inx].oper_consumption_method,
              oper_consumption_method: this.serviceData.oper_res[inx].oper_consumption_method,
              resource_code: this.serviceData.oper_res[inx].ResCode,
              resource_name: this.serviceData.oper_res[inx].ResName,
              resource_type: this.serviceData.oper_res[inx].ResType,
              resource_uom: this.serviceData.oper_res[inx].ResUOM,
              resource_consumption: parseFloat(this.serviceData.oper_res[inx].ResCons).toFixed(3),
              resource_inverse: parseFloat(this.serviceData.oper_res[inx].ResInv).toFixed(3),
              no_resource_used: this.serviceData.oper_res[inx].ResUsed,
              time_uom: this.serviceData.oper_res[inx].TimeUOM,
              time_consumption: parseFloat(this.serviceData.oper_res[inx].TimeCons).toFixed(3),
              time_inverse: parseFloat(this.serviceData.oper_res[inx].TimeInv).toFixed(3),
              resource_consumption_type: res_consum_type,
              basis: basis,
              is_basis_disabled: is_basis_disabled,
              schedule: this.serviceData.oper_res[inx].schedule,
              is_resource_disabled: true,
              unique_key: this.serviceData.unique_key
            });
          }

          this.resourceServiceOperCM = this.serviceData.oper_res[inx].oper_consumption_method;
        }

        if (this.serviceData.oper_code != "" && this.serviceData.oper_code != null && this.serviceData.oper_code != undefined) {
          this.resourceServiceOper = this.serviceData.oper_code;
        }

        if (this.serviceData.wc_code != "" && this.serviceData.wc_code != null && this.serviceData.wc_code != undefined) {
          this.resourceServiceWc = this.serviceData.wc_code;
        }

        this.showLoader = false;
        this.LookupDataLoaded = true;
        this.routing_resource_show = true;
       // console.log("routing_resource_modal show ");
      //  $("#routing_resource_modal").modal('show');

      }
    }
  }
  attribute_master_update() {   
    this.is_attribute_master_popup_lookup_open = false;
    if (this.attributeMasterServiceData.length == 0) {
      this.CommonService.show_notification(this.language.cannot_submit_empty_resource, 'error');     
      return;
    } 
    this.lookupvalue.emit(this.attributeMasterServiceData);
    this.add_atttribute_master = false;
  }

  attribute_update() {   
    this.is_attribute_popup_lookup_open = false;
    if (this.attributeServiceData.length == 0) {
      this.CommonService.show_notification(this.language.cannot_submit_empty_resource, 'error');     
      return;
    } 
    this.lookupvalue.emit(this.attributeServiceData);
    this.close_kendo_dialog();
  }

  operation_resource_update() {
    this.is_operation_popup_lookup_open = false;
    if (this.resourceServiceData.length == 0) {
      this.CommonService.show_notification(this.language.cannot_submit_empty_resource, 'error');     
      return;
    } else {
      for (let ia = 0; ia < this.resourceServiceData.length; ia++) {
        let res_row = this.resourceServiceData[ia];
        if (res_row.resource_code == "") {
          this.CommonService.show_notification(this.language.resource_code_cannot_beblack + ' ' + (ia + 1), 'error'); 
             return
        }
      }
    }
    this.lookupvalue.emit(this.resourceServiceData);
   this.close_kendo_dialog();
  }

  // close_lookup(lookup_id) {
  //   console.log("lookup id - " + lookup_id);
  //   $("#" + lookup_id).modal('hide');

  //   //clear arrays after close button clicked on print model 
  //   if (this.popup_lookupfor == 'output_invoice_print') {
  //     this.cleanup_print_arrays();

  //     // popup_lookupfor  = "";
  //     setTimeout(() => {
  //       this.popup_lookupfor = "";
  //     });
  //     this.current_popup_row = "";
  //   }

  //   if (lookup_id == "routing_resource_modal" || this.popup_lookupfor == 'routing_resource_lookup') {
  //     console.log('in array cleaner');
  //     this.is_operation_popup_lookup_open = false;
  //     this.resourceServiceOper = "";
  //     this.resourceServiceOperCM = "";
  //     this.resourceServiceWc = "";
  //     this.lookupvalue.emit('');
  //     this.resourceServiceData = [];
  //     $("#routing_resource_modal").modal('hide');
  //   }

  // }
  insert_new_attribute_master() {
    if (this.attributeMasterServiceData == undefined || this.attributeMasterServiceData == null || this.attributeMasterServiceData == "") {
      this.attributeMasterServiceData = [];
    }
    this.attribute_master_counter = 0;
    if (this.attributeMasterServiceData.length > 0) {
      this.attribute_master_counter = this.attributeMasterServiceData.length
    }
    this.attribute_master_counter++;   
    this.attributeMasterServiceData.push({      
      rowindex: this.attribute_master_counter,
      OPTM_FEATUREDTLROWID: this.itemRowIndex,
      OPTM_FEATUREID: this.itemFeatureId,
      OPTM_ATTR_CODE: '',
      OPTM_ATTR_NAME: '',
      OPTM_OPTION: '',
      OPTM_OPTION_VALUE: '',     
      OPTM_INPUT: '',
      OPTM_ATTR_VALUE: '',
      OPTM_SEQ: 0
         
    });
  }

  insert_new_attribute() {
    if (this.attributeServiceData == undefined || this.attributeServiceData == null || this.attributeServiceData == "") {
      this.attributeServiceData = [];
    }
    this.attribute_counter = 0;
    if (this.attributeServiceData.length > 0) {
      this.attribute_counter = this.attributeServiceData.length
    }
    this.attribute_counter++;   
    this.attributeServiceData.push({      
      rowindex: this.attribute_counter,
      OPTM_FEATUREDTLROWID: this.itemRowIndex,
      OPTM_FEATUREID: this.itemFeatureId,
      OPTM_ATTR_CODE: '',
      OPTM_ATTR_NAME: '',
      OPTM_OPTION: '',
      OPTM_OPTION_VALUE: '',     
      OPTM_INPUT: '',
      OPTM_ATTR_VALUE: '',
      OPTM_SEQ: 0,
      attribute_desc_disable: true,
      attribute_option_disable: true,
     
    });
  }

  insert_new_resource() {
    console.log("this.resourceServiceData - ", this.resourceServiceData);
    if (this.resourceServiceData == undefined || this.resourceServiceData == null || this.resourceServiceData == "") {
      this.resourceServiceData = [];
    }
    this.resource_counter = 0;
    if (this.resourceServiceData.length > 0) {
      this.resource_counter = this.resourceServiceData.length
    }
    let  unqiue_key = '';
    if(this.serviceData.unique_key == undefined || this.serviceData.unique_key == "" || this.serviceData.unique_key == null ){
      if(this.resourceServiceData[0].unique_key !== undefined){
        unqiue_key  = this.resourceServiceData[0].unique_key;
      }

    } else {
      unqiue_key = this.serviceData.unique_key ;
    }

    let basis = '1';
    let is_basis_disabled = false;
    if (this.resourceServiceOperCM == '1' || this.resourceServiceOperCM == 1) { // setup 
      is_basis_disabled = true;
      basis = '4';
      this.resource_basisdd = [
      { "value": '4', "Name": "Setup" }
      ]
    }

    if (this.resourceServiceOperCM == '2' || this.resourceServiceOperCM == 2) { // variable
      is_basis_disabled = false;
      basis = '1';
      this.resource_basisdd = [
      { "value": '1', "Name": "Item" },
      { "value": '4', "Name": "Setup" }
      ]
    }

    if (this.resourceServiceOperCM == '3' || this.resourceServiceOperCM == 3) { // Fixed
      is_basis_disabled = false;
      basis = '1';
      this.resource_basisdd = [
      { "value": '1', "Name": "Item" },
      { "value": '2', "Name": "Batch" },
      { "value": '4', "Name": "Setup" }
      ]
    }

    this.resource_counter++;
    console.log("this.serviceData.unique_key ", this.serviceData.unique_key, "unqiue_key ", unqiue_key);
    this.resourceServiceData.push({
      lineno: this.resource_counter,
      rowindex: this.resource_counter,
      operation_no: this.resourceServiceOper,
      resource_code: '',
      resource_name: '',
      resource_uom: '',
      resource_type: '',
      resource_consumption: parseFloat("1").toFixed(3),
      resource_inverse: parseFloat("0").toFixed(3),
      no_resource_used: parseInt("1"),
      time_uom: '',
      time_consumption: parseFloat("0").toFixed(3),
      time_inverse: parseFloat("0").toFixed(3),
      resource_consumption_type: this.resourceServiceOperCM,
      oper_consumption_method: this.resourceServiceOperCM,
      oper_consumption_type: this.resourceServiceOperCM,
      basis: basis,
      is_basis_disabled: is_basis_disabled,
      schedule: false,
      is_resource_disabled: true,
      unique_key: unqiue_key
    });
  }
  onDeleteAttributeRow(rowindex) {
    if (this.attributeMasterServiceData.length > 0) {
      for (let i = 0; i < this.attributeMasterServiceData.length; ++i) {
        if (this.attributeMasterServiceData[i].rowindex === rowindex) {
          this.attributeMasterServiceData.splice(i, 1);
          i = i - 1;
        }
        else {
          this.attributeMasterServiceData[i].rowindex = i + 1;
        }
      }
    }
  }

  onDeleteRow(rowindex) {
    if (this.resourceServiceData.length > 0) {
      for (let i = 0; i < this.resourceServiceData.length; ++i) {
        if (this.resourceServiceData[i].rowindex === rowindex) {
          this.resourceServiceData.splice(i, 1);
          i = i - 1;
        }
        else {
          this.resourceServiceData[i].rowindex = i + 1;
        }
      }
    }
  }

  open_resource_lookup(type, rowindex) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.rs.getResourceList(this.resourceServiceWc).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.router, 'Sessionout');             
              this.showLookupLoader = false;
              return;
            }

            this.current_popup_row = rowindex;
            this.table_head = [
            {
              field: 'ResCode',
              title: this.language.resource_code,
              type: 'text',
              width: '100',
              attrType: 'text'
            },
            {
              field: 'Name',
              title: this.language.resource_name,
              type: 'text',
              width: '100',
              attrType: 'text'
            },
            {
              field: 'NumberOfRes',
              title: this.language.numberofres,
              type: 'text',
              width: '100',
              attrType: 'text'
            },
            {
              field: 'WCCode',
              title: this.language.workcenter_code,
              type: 'text',
              width: '100',
              attrType: 'text'
            }];
            this.serviceData = data;
            this.popup_title = this.language.resources;
            this.dialogOpened = true;
            this.popup_resource = true;
            this.routing_resource_show = true;
          }
          else {
            this.dialogOpened = false;
            this.CommonService.show_notification(this.language.NoDataAvailable, 'error');           
            return;
          }
        } else {
          this.dialogOpened = false;
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');         
          return;
        }
      },
      error => {
        this.dialogOpened = false;
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.CommonService.isUnauthorized();
        } else {
          this.CommonService.show_notification(this.language.server_error, 'error');
          
        }
      }
      )
  }

  open_attribute_lookup(type, rowindex) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.fms.GetModelFeatureAttributeList().subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.router, 'Sessionout');             
              this.showLookupLoader = false;
              return;
            }

            this.current_popup_row = rowindex;
            this.table_head = [
            {
              field: 'OPTM_ATTR_CODE',
              title: this.language.attribute_id,
              type: 'text',
              width: '100',
              attrType: 'text'
            },
            {
              field: 'OPTM_ATTR_NAME',
              title: this.language.attribute_desc,
              type: 'text',
              width: '100',
              attrType: 'text'
            },
            {
              field: 'OPTM_OPTION',
              title: this.language.option,
              type: 'text',
              width: '100',
              attrType: 'text'
            }];
            this.serviceData = data;
            this.popup_title = this.language.attribute;
            this.popup_attribute = true;
            this.dialogOpened = true;            
            this.add_atttribute_master= true;
          }
          else {
            this.dialogOpened = false;
            this.CommonService.show_notification(this.language.NoDataAvailable, 'error');           
            return;
          }
        } else {
          this.dialogOpened = false;
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');         
          return;
        }
      },
      error => {
        this.dialogOpened = false;
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.CommonService.isUnauthorized();
        } else {
          this.CommonService.show_notification(this.language.server_error, 'error');
          
        }
      }
      )
  }

  on_input_change_attribute_master(value, rowindex, grid_element) {
    var currentrow = 0;
    for (let i = 0; i < this.attributeMasterServiceData.length; ++i) {
      if (this.attributeMasterServiceData[i].rowindex === rowindex) {
        currentrow = i;
        break;
      }
    } 
    if (grid_element == 'attribute_id') {
      this.attributeMasterServiceData[currentrow].OPTM_ATTR_CODE = value;
    }
    if (grid_element == 'attribute_desc') {
      this.attributeMasterServiceData[currentrow].OPTM_ATTR_NAME = value;
    }
    if (grid_element == 'option') {
      this.attributeMasterServiceData[currentrow].OPTM_OPTION = this.detail_select_options[value-1].Name;
    }
    // if (grid_element == 'optionValue') {
    //   this.attributeMasterServiceData[currentrow].OPTM_OPTION_VALUE = value;
    // }
    // if (grid_element == 'value') {
    //   this.attributeMasterServiceData[currentrow].OPTM_VALUE = value;
    // }
    // if (grid_element == 'inputs') {
    //   this.attributeMasterServiceData[currentrow].OPTM_INPUT = value;
    // }


  }
  on_input_change_attribute(value, rowindex, grid_element) {
    var currentrow = 0;
    for (let i = 0; i < this.attributeServiceData.length; ++i) {
      if (this.attributeServiceData[i].rowindex === rowindex) {
        currentrow = i;
        break;
      }
    } 
    if (grid_element == 'attribute_id') {
      this.attributeServiceData[currentrow].OPTM_ATTR_CODE = value;
    }
    if (grid_element == 'attribute_desc') {
      this.attributeServiceData[currentrow].OPTM_ATTR_NAME = value;
    }
    if (grid_element == 'option') {
      this.attributeServiceData[currentrow].OPTM_OPTION = value;
    }
    if (grid_element == 'optionValue') {
      this.attributeServiceData[currentrow].OPTM_OPTION_VALUE = value;
    }
    if (grid_element == 'value') {
      this.attributeServiceData[currentrow].OPTM_VALUE = value;
    }
    if (grid_element == 'inputs') {
      this.attributeServiceData[currentrow].OPTM_INPUT = value;
    }


  }

  on_input_change(value, rowindex, grid_element) {
    var currentrow = 0;
    for (let i = 0; i < this.resourceServiceData.length; ++i) {
      if (this.resourceServiceData[i].rowindex === rowindex) {
        currentrow = i;
      } else {
        if (grid_element == 'schedule') {
          this.resourceServiceData[i].schedule = false;
        }
      }
    }
    console.log(currentrow);
    if (grid_element == 'operation_no') {

    }

    if (grid_element == 'resource_code') {
      this.showLookupLoader = true;
      this.rs.getResourceDetail(value).subscribe(
        data => {
          console.log(data);
          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.router, 'Sessionout');
                this.showLookupLoader = false;
                return;
              }
              this.resourceServiceData[currentrow].resource_code = data[0].ResCode;
              this.resourceServiceData[currentrow].resource_name = data[0].Name;
              this.resourceServiceData[currentrow].resource_uom = data[0].UnitOfMsr;
              this.resourceServiceData[currentrow].resource_type = data[0].ResType;
              this.get_consumption_inverse_value('consumption', 1, this.resourceServiceData[currentrow].resource_code, currentrow);
              this.showLookupLoader = false;
            } else {
              this.CommonService.show_notification(this.language.invalidrescodeRow + ' ' + rowindex, 'error');
              this.clearInvalidRes(currentrow);
              this.showLookupLoader = false;
              return;
            }
          } else {
            this.CommonService.show_notification(this.language.invalidrescodeRow + ' ' + rowindex, 'error');            
            this.clearInvalidRes(currentrow);
            this.showLookupLoader = false;
            return;
          }
        }, error => {
          this.showLookupLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.CommonService.isUnauthorized();
          } else {
            this.CommonService.show_notification(this.language.invalidrescodeRow + ' ' + rowindex, 'error');
            this.clearInvalidRes(currentrow);

          }
          return;
        }
        );
    }

    if (grid_element == 'resource_name') {

    }

    if (grid_element == 'resource_uom') {

    }

    if (grid_element == 'resource_consumption') {

      if (value == 0 && value != '') {
        value = 1;
        this.CommonService.show_notification(this.language.consumption_type_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error'); 
         }
      else {
        if (isNaN(value) == true) {
          value = 1;
          this.CommonService.show_notification(this.language.ValidNumber, 'error'); 
        } else if (value == 0 || value == '' || value == null || value == undefined) {
          value = 1;
          this.CommonService.show_notification(this.language.blank_or_zero_ct_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error');  
       } else if (value < 0) {
          value = 1;
          this.CommonService.show_notification(this.language.negative_ct_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error'); 
         
        }
      }

      this.resourceServiceData[currentrow].resource_consumption = parseFloat(value).toFixed(3);     
      (<HTMLInputElement>document.getElementsByClassName("row_resource_consumption")[currentrow]).value = parseFloat(value).toFixed(3);  
      if (this.resourceServiceData[currentrow].resource_code != "" && this.resourceServiceData[currentrow].resource_code != undefined && this.resourceServiceData[currentrow].resource_code != null) {
        this.get_consumption_inverse_value('consumption', value, this.resourceServiceData[currentrow].resource_code, currentrow);
      } else {
        this.resourceServiceData[currentrow].time_consumption = parseFloat('0').toFixed(3);
        this.resourceServiceData[currentrow].time_inverse = parseFloat('0').toFixed(3);
      }

    }

    if (grid_element == 'resource_inverse') {
      if (value == 0 && value != '') {
        value = 1;
        this.CommonService.show_notification(this.language.inverse_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error'); 
         }
      else {
        if (isNaN(value) == true) {
          value = 1;
          this.CommonService.show_notification(this.language.ValidNumber, 'error');         
        } else if (value == 0 || value == '' || value == null || value == undefined) {
          value = 1;
          this.CommonService.show_notification(this.language.blank_or_zero_inverse_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error');          
        } else if (value < 0) {
          value = 1;
          this.CommonService.show_notification(this.language.negative_inverse_valid  + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error');          
        }
      }
      this.resourceServiceData[currentrow].resource_inverse = parseFloat(value).toFixed(3);     
      (<HTMLInputElement>document.getElementsByClassName("row_resource_inverse")[currentrow]).value = parseFloat(value).toFixed(3);  
      if (this.resourceServiceData[currentrow].resource_code != "" && this.resourceServiceData[currentrow].resource_code != undefined && this.resourceServiceData[currentrow].resource_code != null) {
        this.get_consumption_inverse_value('inverse', value, this.resourceServiceData[currentrow].resource_code, currentrow);
      } else {
        this.resourceServiceData[currentrow].time_consumption = parseFloat('0').toFixed(3);
        this.resourceServiceData[currentrow].time_inverse = parseFloat('0').toFixed(3);
      }


    }

    if (grid_element == 'no_resource_used') {
      if (value == 0 && value != '') {
        value = 1;
        this.resourceServiceData[currentrow].no_resource_used = value;
        this.CommonService.show_notification(this.language.no_of_resource_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error');
       
      }
      else {
        let rgexp = /^\d+$/;
        if (isNaN(value) == true) {
          value = 1;
          this.CommonService.show_notification(this.language.ValidNumber, 'error');         
        } else if (value == 0 || value == '' || value == null || value == undefined) {
          value = 1;
          this.CommonService.show_notification(this.language.blank_or_zero_noresused_not_allowed + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error');          
        } else if (value < 0) {
          value = 1;
          this.CommonService.show_notification(this.language.negative_resource_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error'); 
          
        } else if (rgexp.test(value) == false) {
          value = 1;
          this.CommonService.show_notification(this.language.decimal_noresused_valid + ' ' + this.language.at_row + ' ' + (currentrow + 1), 'error'); 
        }
        this.resourceServiceData[currentrow].no_resource_used = (value);

      }
      (<HTMLInputElement>document.getElementsByClassName("row_no_resource_used")[currentrow]).value = value;     
    }

    if (grid_element == 'time_uom') {
      this.resourceServiceData[currentrow].time_uom = (value);
    }

    if (grid_element == 'time_consumption') {
      this.resourceServiceData[currentrow].time_consumption = parseFloat(value).toFixed(3);
    }

    if (grid_element == 'time_inverse') {
      this.resourceServiceData[currentrow].time_inverse = parseFloat(value).toFixed(3);
    }

    if (grid_element == 'resource_consumption_type') {
      this.resourceServiceData[currentrow].resource_consumption_type = (value);
    }

    if (grid_element == 'resource_basic') {
      this.resourceServiceData[currentrow].resource_basic = (value);
    }

    if (grid_element == 'schedule') {
      this.resourceServiceData[currentrow].schedule = (value);
    }
  }

  clearInvalidRes(currentrow) {
    this.resourceServiceData[currentrow].resource_code = "";
    this.resourceServiceData[currentrow].resource_name = "";
    this.resourceServiceData[currentrow].resource_uom = "";
    this.resourceServiceData[currentrow].resource_type = "";

    (<HTMLInputElement>document.getElementsByClassName("row_resource_code")[currentrow]).value = "";
    (<HTMLInputElement>document.getElementsByClassName("row_resource_name")[currentrow]).value = "";
    (<HTMLInputElement>document.getElementsByClassName("row_resource_uom")[currentrow]).value = "";   
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
    this.lookupvalue.emit('');
    this.dialogOpened = false;
    this.current_popup_row = "";
    this.show_associate_bom_popup = false;
    this.rule_selection_show = false;
    this.routing_resource_show = false;
    this.add_atttribute_show = false;
    this.add_atttribute_master = false;
    this.reportDialogOpened = false;
  }


  public close_report_kenod_dialog(){
    this.lookupvalue.emit('');
    this.dialogOpened = false;
  }
  public close_inner_kenod_dialog(){
    this.lookupvalue.emit('');
    this.dialogOpened = false;
    this.viewAttributeDialogOpened = false;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadServerData(this.serviceData);
  }

}
