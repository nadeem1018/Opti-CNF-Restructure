import { Component, OnInit } from '@angular/core';
import { CommonData } from 'src/app/core/data/CommonData';

@Component({
  selector: 'app-cw-operation-customer',
  templateUrl: './cw-operation-customer.component.html',
  styleUrls: ['./cw-operation-customer.component.scss']
})
export class CwOperationCustomerComponent implements OnInit {
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public step1_data: any = [];
  public stepp_data: any = [];
  public made_changes: boolean = false;
  public iLogID: string;
  public contact_persons: any[];
  public ship_to: any[];
  public bill_to: any[];
  public sales_employee: any[];
  public owner_list: any[];
  public new_output_config: boolean = false;
  public modify_duplicate_selected:  boolean = false;
  public step3_data_final: any[];
  public step4_final_prod_total: any = 0;
  public step4_final_acc_total: any = 0;
  public step4_final_grand_total: any = 0;
  public prod_discount_log: number;
  public access_dis_amount_log: number;
  public step3_feature_price_bef_dis: number;
  public step3_acc_price_bef_dis: number;
  public step0_isNextButtonVisible: boolean;
  public isNextButtonVisible: boolean;
  public text_input_elem: any;
  
  constructor() { }

  ngOnInit() {
  }

  onOperationChange(operation_type) {
    this.made_changes = true;
    this.step1_data = [];
    /* const inpueElem = document.getElementById('description');
    inpueElem.focus();     */
    this.iLogID = '';
    let cDate = new Date();
    this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    this.contact_persons = [];
    this.ship_to = [];
    this.bill_to = [];
    this.sales_employee = [];
    this.owner_list = [];
    this.step1_data.selected_configuration_key = "";
    this.step1_data.description = "";
    this.new_output_config = false;
    this.clear_all_screen_data();
    this.modify_duplicate_selected = false;
    this.step3_data_final = [];
    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;
    this.clear_all_screen_data();
    if (operation_type == 2 || operation_type == 3 || operation_type == 4) {
      this.modify_duplicate_selected = true;
      this.new_output_config = true;
      this.step0_isNextButtonVisible = true;
    } else {
      if (operation_type == "") {
        this.new_output_config = false;
        this.step0_isNextButtonVisible = false;
      } else {
        this.new_output_config = true;
        this.step0_isNextButtonVisible = true;
        this.step1_data.document = 'draft';
        this.step1_data.document_name = this.language.draft;
        this.isNextButtonVisible = true;
      }

      this.modify_duplicate_selected = false;
    }
    if(this.text_input_elem != undefined) {
      this.text_input_elem.nativeElement.focus();
    }
    setTimeout(function(){
      // $(document).find("#description").focus();
    }, 10);
    this.step1_data.main_operation_type = operation_type;
  }
  clear_all_screen_data() {
    throw new Error("Method not implemented.");
  }
}
