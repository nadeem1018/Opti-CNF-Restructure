import { Component, OnInit } from '@angular/core';
import { CommonData } from 'src/app/core/data/CommonData';

@Component({
  selector: 'app-cw-view',
  templateUrl: './cw-view.component.html',
  styleUrls: ['./cw-view.component.scss']
})
export class CwViewComponent implements OnInit {
  public commonData = new CommonData();
  public selectedImage = "";
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modify_duplicate_selected: boolean = false;
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public getSavedModelData = [];
  public step1_data: any = [];
  public stepp_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public FeatureChildData = [];
  public feature_itm_list_table = [];
  public accessory_itm_list_table = [];
  public feature_itm_list_temp_table = [];
  public parentfeatureid: string = "";
  public feature_discount_percent: number = 0;
  public discount_price: number = 0;
  public accessory_discount_percent: number = 0;
  public step2_final_dataset_to_save = [];
  public tree_accessory_json = [];
  public Accessoryarray = [];
  public ModelHeaderItemsArray = [];
  public ModelBOMRules = [];
  public warehouse: string = "";
  public currentDate = new Date();
  public submit_date;
  public showLookupLoader: boolean = false;
  public step2_selected_model: any = '';
  public step2_selected_model_id: any = '';
  public step4_final_prod_total: any = 0;
  public step4_final_acc_total: any = 0;
  public step4_final_grand_total: any = 0;
  public step4_final_DetailModelData = [];

  //Outputlog
  public prod_discount_log: any = 0;
  public access_dis_amount_log: any = 0;
  public isPreviousPressed: boolean = false;
  public isDuplicate: boolean = false;
  public navigationSubscription;
  public defaultCurrency = sessionStorage.defaultCurrency;
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension, "", "", "delete"];
  public step3_data_final_hidden_elements = [false, false, false, false, false, false, true, true, false, false];
  public step4_data_final_hidden_elements = [false, false, false, false, false, false, true, true, true];
  public feature_total_before_discount = 0;
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public step3_feature_price_bef_dis: number = 0
  public step3_acc_price_bef_dis: number = 0
  public acc_item_tax: number = 0
  public bycheckboxpress: number = 0;
  public acc_total: number = 0
  public accessory_item_tax: number = 0;
  public accessory_item_total: number = 0;
  public acc_grand_total: number = 0;
  public isModelVisible: boolean = false;
  public selecteddataforelement: any;
  public final_document_number: any = '';
  public selectfeaturedata = [];
  public modelitemflag: number = 0;
  public final_array_checked_options = [];
  public navigatenextbtn: boolean = false;
  public validnextbtn: boolean = true;
  public showPrintOptions: boolean = false;
  public previousquantity: any = parseFloat("1").toFixed(3);
  public feature_tax_total = [
  { "key": this.language.tax, "value": this.feature_item_tax },
  { "key": this.language.total, "value": this.feature_item_total },
  ];
  public item_tax_total = [
  { "key": this.language.product_tax, "value": this.acc_item_tax },
  { "key": this.language.product_total, "value": this.acc_total },
  { "key": this.language.accessories_discount, "value": this.acc_item_tax },
  { "key": this.language.accessories_tax, "value": this.acc_item_tax },
  { "key": this.language.accessories_total, "value": this.acc_total },
  { "key": this.language.grand_total, "value": this.acc_grand_total }
  ];
  public new_item_list = [];
  public showFinalLoader: boolean = true;
  public dontShowFinalLoader: boolean = false;
  public Accessory_table_hidden_elements = [false, false, false, true, true, true, true];
  public order_creation_table_head = [this.language.hash, 'SI#', this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension];
  feature_child_data: any = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  Object = Object;
  console = console;
  public ruleData: any = [];
  public isSecondIteration = false
  public ruleIndex: number = 0; 
  serviceData: any;
  public new_output_config: boolean = false;
  public contact_persons: any = [];
  public sales_employee: any = [];
  public ship_to: any = [];
  public bill_to: any = [];
  public ship_data: any = [];
  public bill_data: any = [];
  public owner_list: any = [];
  public customerBillTo: any;
  public document: any;
  public customerShipTo: any;
  public isNextButtonVisible: boolean = false;
  public person: any;
  public salesemployee: any;
  public step3_data_final = [];
  public document_date = '';
  public iLogID: any = '';
  public CheckedData: any = [];
  public selectallRows: boolean = false;
  public isMultiDelete: boolean = false;
  rows: any = "";
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public final_row_data: any;
  public final_order_status = this.language.new;
  public final_order_status_class = "text-primary";
  public final_reference_number = "";
  public final_ref_doc_entry = "";
  public ModelHeaderData = [];
  public ModelBOMDataForSecondLevel = [];
  public FeatureBOMDataForSecondLevel = [];
  public RuleOutputData = [];
  public checked: boolean = false;
  public globalConfigId: any = '';
  public description: any;
  public step0_isNextButtonVisible: boolean = false;
  public setModelDataFlag: boolean = false;
  public defaultitemflagid: any;
  public ModelLookupFlag = false
  public cDate = new Date();
  public AccessModel: any = [];
  public SelectedAccessory: any = [];
  public selectedAccessoryHeader: any = []
  public selectedAccessoryBOM: any = []
  public menu_auth_index = '205';
  public made_changes:boolean = false;
  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public min;
  
  constructor() { }

  ngOnInit() {
    
  }

}
