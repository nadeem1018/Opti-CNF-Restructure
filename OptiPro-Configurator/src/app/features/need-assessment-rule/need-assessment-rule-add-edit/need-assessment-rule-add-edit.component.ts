import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData, ColumnSetting } from 'src/app/core/data/CommonData';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { RulewbService } from 'src/app/core/service/rulewb.service';
import { DialogService } from 'src/app/core/service/dialog.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ModelbomService } from 'src/app/core/service/modelbom.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NeedsAssessmentTemplateService } from 'src/app/core/service/needs-assessment-template.service';
import { NeedassessmentruleService } from 'src/app/core/service/needassessmentrule.service';

@Component({
  selector: 'app-need-assessment-rule-add-edit',
  templateUrl: './need-assessment-rule-add-edit.component.html',
  styleUrls: ['./need-assessment-rule-add-edit.component.scss']
})
export class NeedAssessmentRuleAddEditComponent implements OnInit {

  @ViewChild("rulecode", { static: true }) _el: ElementRef;
  @ViewChild("showOutputButton", { static: true }) _ele: ElementRef;
  public commonData = new CommonData();
  public view_route_link = '/need-assessment-rule/view';
  public input_file: File = null;
  public global_rule_feature_data = new Array();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public rule_wb_data: any = new Array();
  public rule_sequence_data = new Array();
  public rule_feature_data = new Array();
  public rule_expression_data: any = new Array();
  public image_data: any = new Array();
  public feature_bom_header_details: any = new Array();
  public lookupfor: string = '';
  public counter = 0;
  public expression_counter = 0;
  public currentrowindex: number;
  public showAddSequenceBtn: boolean = false;
  public showUpdateSequenceBtn: boolean = false;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public show_sequence: boolean = false;
  public show_add_sequence_btn: boolean = true;
  public showImageBlock: boolean = false;
  public selectedImage = "";
  public isPriceDisabled = true;
  public pricehide = true;
  public isUOMDisabled = true;
  public update_id: string = "";
  public selectall: boolean = true;
  public typevaluefromdatabase: string = "";
  public typevaluecodefromdatabase: string = "";
  public operand_type: any = '';
  public add_sequence_mode: boolean = false;
  public update_sequence_mode: boolean = false;
  public is_applicable_for_disabled: boolean = false;
  public made_changes: boolean = false;
  public assesment_ID = "";
  public sidebarSize = "0%";
  public resizablePanel: boolean = false;
  public collapsiblePanelFirst: boolean = false;
  public collapsiblePanelSecond: boolean = false;
  
  collapsible
  //public rule_wb_data_header: any = [];
  public ruleWorkBenchData = new Array();
  public defaultCurrency = sessionStorage.defaultCurrency;
  public isModelIdEnable: boolean = true;
  public ModelLookupBtnhide: boolean = true;
  public editeffectivefrom: any = "";
  public editeffectiveto: any = "";
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private assessmentRuleService: NeedassessmentruleService, private assessmentService: NeedsAssessmentTemplateService, private service: RulewbService, private CommonService: CommonService, private DialogService: DialogService) { }

  page_main_title = this.language.need_assessment_rule
  serviceData: any;
  public showoutput_btn_text = this.language.show_output;
  public is_showoutput_visible = 0;
  public showOutputBtn: boolean = true;
  public generated_expression_value = "";
  public seq_count = 0;
  public editing_row = 0;
  public outputrowcounter: number = 0;
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  public isExcluded: boolean = false;

  public code_disabled = "false";
  public isOutputTable: boolean = true;
  public isDuplicateMode: boolean = false;
  public NewRuleId = "";

  imgPath = 'assets/images';
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public dialog_box_value: any;
  public row_id: any;
  public menu_auth_index = '204';


  record_per_page: any;
  search_string: any = "";
  current_page: any = 1;
  page_numbers: any = "";
  dataArray: any = [];
  public CheckedData: any = [];
  public allowUnsort = true;
  public sort: SortDescriptor[];
  public gridView: GridDataResult;
  public min;
  public columns: ColumnSetting[] = [
    {
      field: 'OPTM_MODELCODE',
      title: this.language.model_ModelCode,
      type: 'text',
      width: '100',
      attrType: 'link'
    },
    {
      field: 'OPTM_DISPLAYNAME',
      title: this.language.Name,
      type: 'text',
      width: '100',
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


  canDeactivate() {
    if (CommonData.made_changes == true) {
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }

  detect_change() {
    CommonData.made_changes = true;
  }

  ngOnInit() {

    this.global_rule_feature_data = new Array();
    this.rule_feature_data = new Array();

    let d = new Date();
    this.min = new Date(d.setDate(d.getDate() - 1));
    this.commonData.checkSession();
    this.rule_wb_data.username = sessionStorage.getItem('loggedInUser');
    this.rule_wb_data.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.rule_wb_data.RuleId = "";
    this.rule_wb_data.discontinued = false;
    this.rule_wb_data.Excluded = false;

    // check screen authorisation - start
    this.CommonService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          let objcc = this;
          setTimeout(function () {
            this.CommonService.show_notification(this.language.notAuthorisedScreen, 'error');
            objcc.route.navigateByUrl('home');
          }, 200);
        }
      }, error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      });
    // check screen authorisation - end

    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      CommonData.made_changes = true;
      this.isUpdateButtonVisible = false;
      this.code_disabled = "false";
      this.isSaveButtonVisible = true;
      this.isDeleteButtonVisible = false;
      this.show_sequence = false;
      this.show_add_sequence_btn = true
      this._el.nativeElement.focus();
      var current_date = new Date();
      this.rule_wb_data.effective_from = new Date((current_date.getMonth() + 1) + '/' + current_date.getDate() + '/' + current_date.getFullYear());
      this.showLoader = false;
      this.is_applicable_for_disabled = false;
      this.isDuplicateMode = false;
    } else {
      CommonData.made_changes = false;
      if (this.ActivatedRouter.snapshot.url[0].path == "edit") {
        this.isUpdateButtonVisible = true;
        this.code_disabled = "true";
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = false;
        this.show_sequence = false;
        this.show_add_sequence_btn = true
        this.is_applicable_for_disabled = true;
        this.isDuplicateMode = false;
      } else if (this.ActivatedRouter.snapshot.url[0].path == "add") {
        this.isUpdateButtonVisible = false;
        this.code_disabled = "false";
        this.isSaveButtonVisible = true;
        this.isDeleteButtonVisible = false;
        this.show_sequence = false;
        this.show_add_sequence_btn = true
        this.is_applicable_for_disabled = true;
        this.isDuplicateMode = true;
      }


      var obj = this;
      this.assessmentRuleService.GetDataByRuleID(this.update_id).subscribe(
        data => {
          // if (data != undefined && data.LICDATA != undefined) {
          //   if (data.LICDATA[0].ErrorMsg == "7001") {
          //     CommonData.made_changes = false;
          //     this.CommonService.RemoveLoggedInUser().subscribe();
          //     this.CommonService.signOut(this.route, 'Sessionout');
          //     return;
          //   }
          // }
          console.log(data);
          if (data.NeedsAssessmentRuleHeader.length > 0) {
            if (data.NeedsAssessmentRuleHeader[0].OPTM_DISCONTINUE === "False") {
              this.rule_wb_data.discontinued = false
            }
            else {
              this.rule_wb_data.discontinued = true
            }
            // if (data.NeedsAssessmentRuleHeader[0].OPTM_EXCLUDED === "False" || data.NeedsAssessmentRuleHeader[0].OPTM_EXCLUDED === null) {
            //   this.rule_wb_data.Excluded = false
            // }
            // else {
            //   this.rule_wb_data.Excluded = true
            // }
            if (this.isDuplicateMode) {
              this.rule_wb_data.rule_code = "";
              this.rule_wb_data.description = "";
              var current_date = new Date();
              this.rule_wb_data.effective_from = new Date((current_date.getMonth() + 1) + '/' + current_date.getDate() + '/' + current_date.getFullYear());
            } else {
              this.rule_wb_data.rule_code = data.NeedsAssessmentRuleHeader[0].OPTM_RULECODE
              this.rule_wb_data.description = data.NeedsAssessmentRuleHeader[0].OPTM_DESCRIPTION;

              var effectiveFrom;
              var effectiveTo;
              if (data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVEFROM !== undefined && data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVEFROM != "" && data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVEFROM != null) {
                var temp = new Date(data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVEFROM);
                effectiveFrom = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
              }

              if (data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVETO !== undefined && data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVETO != "" && data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVETO != null) {
                var temp2 = new Date(data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVETO);
                effectiveTo = new Date((temp2.getMonth() + 1) + '/' + temp2.getDate() + '/' + temp2.getFullYear());
              }

              this.rule_wb_data.effective_from = effectiveFrom;
              this.rule_wb_data.effective_to = effectiveTo;
              this.editeffectivefrom = effectiveFrom
              this.editeffectiveto = effectiveTo
            }
            /* this.rule_wb_data.effective_from = new Date(data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVEFROM);
            this.rule_wb_data.effective_to  = new Date(data.NeedsAssessmentRuleHeader[0].OPTM_EFFECTIVETO); */

            //  this.rule_wb_data.discontinued = data.NeedsAssessmentRuleHeader[0].OPTM_DISCONTINUE;
            // this.rule_wb_data.Excluded=data.NeedsAssessmentRuleHeader[0].OPTM_EXCLUDED; 
            this.rule_wb_data.applicable_for_feature_code = data.NeedsAssessmentRuleHeader[0].OPTM_APPLICABLEFOR;
            this.rule_wb_data.applicable_for_feature_id = data.NeedsAssessmentRuleHeader[0].OPTM_APPLICABLEID;
            this.rule_wb_data.RuleId = data.NeedsAssessmentRuleHeader[0].OPTM_RULEID;

          }
          let seq_counter_array = [];
          if (data.NeedsAssessmentRuleInput.length > 0) {

            this.counter = 0;
            let managed_seq = [1];
            let sequence_gen = [];
            let expression = '';
            let current_exp;
            let forlineno = 0;
            let lineno;

            let input_loop_counter = 0;
            for (let i = 0; i < data.NeedsAssessmentRuleInput.length; ++i) {
              this.counter++;
              // if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE == 1) {
              //   this.typevaluefromdatabase = (data.NeedsAssessmentRuleInput[i].OPTM_FEATURE != "" && data.NeedsAssessmentRuleInput[i].OPTM_FEATURE != null) ? data.NeedsAssessmentRuleInput[i].OPTM_FEATURE.toString() : "";

              // }
              // else {
              //   this.typevaluefromdatabase = (data.NeedsAssessmentRuleInput[i].OPTM_MODEL != "" && data.NeedsAssessmentRuleInput[i].OPTM_MODEL != null) ? data.NeedsAssessmentRuleInput[i].OPTM_MODEL.toString() : "";

              // }
              // if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE == 1) {
              //   this.typevaluecodefromdatabase = data.NeedsAssessmentRuleInput[i].feature_parent_code.toString()

              // }
              // else {
              //   this.typevaluecodefromdatabase = data.NeedsAssessmentRuleInput[i].child_code.toString()

              // }

              let fetch_data = data.NeedsAssessmentRuleInput[i];
              this.seq_count = fetch_data.OPTM_SEQID;
              let current_count = (this.seq_count - 1);
              let c_boj_seq_count = this.seq_count;

              if (seq_counter_array[c_boj_seq_count] == undefined) {
                seq_counter_array[c_boj_seq_count] = input_loop_counter;
              } else {
                input_loop_counter = seq_counter_array[c_boj_seq_count];
              }
              // changed current_count for sequence number not in direct sequence 
              current_count = input_loop_counter;

              if (this.rule_expression_data[current_count] == undefined) {
                this.rule_expression_data[current_count] = {};
                this.rule_expression_data[current_count].expression = "";
              }
              this.rule_expression_data[current_count].rowindex = this.counter
              this.rule_expression_data[current_count].seq_count = this.seq_count;
              if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE == 2) {
                this.rule_expression_data[current_count].expression += fetch_data.OPTM_OPERATOR + ' ' + fetch_data.OPTM_BRACES + ' ' + 'Model' + ' ' + fetch_data.OPTM_CONDITION + ' ' + this.typevaluecodefromdatabase;
              } else {

                this.rule_expression_data[current_count].expression += " " + fetch_data.OPTM_OPERATOR + ' ' + fetch_data.OPTM_BRACES + ' ' + fetch_data.OPTM_NASS_ID + ' ' + fetch_data.OPTM_CONDITION + ' ' + fetch_data.OPTM_OPERAND1 + ' ' + fetch_data.OPTM_OPERAND2;
              }

              if (this.rule_expression_data[current_count].row_data == undefined) {
                this.rule_expression_data[current_count].row_data = [];
              }

              if (this.rule_expression_data[current_count].output_data == undefined) {
                this.rule_expression_data[current_count].output_data = [];
              }

              if (forlineno == 0) {
                forlineno = fetch_data.OPTM_SEQID
                lineno = i + 1;
              }
              else {
                if (forlineno != fetch_data.OPTM_SEQID) {
                  lineno = 1;
                  forlineno = fetch_data.OPTM_SEQID
                }
                else {
                  lineno = lineno + 1;
                }
              }

              let operand2_disabled = true;
              if (fetch_data.OPTM_CONDITION == 'Between') {
                if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE == 1) {
                  operand2_disabled = false;
                } else {
                  operand2_disabled = true;
                }
              }
              if (fetch_data.OPTM_OPERAND1 != "") {
                this.rule_expression_data[current_count]["is_operand1_disable"] = false;
              }
              let operand1_disabled = true;

              // if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE == 2 || data.NeedsAssessmentRuleInput[i].OPTM_TYPE == "") {
              //   operand1_disabled = true;
              // }

              let type_disabled = true;
              // if (data.NeedsAssessmentRuleInput[i].OPTM_TYPE != "") {
              //   type_disabled = false;
              // }
              console.log("current_count ", current_count);
              this.rule_expression_data[current_count].row_data.push({
                lineno: lineno,
                rowindex: fetch_data.OPTM_ROWID,
                seq_count: fetch_data.OPTM_SEQID,
                type_value_code: fetch_data.OPTM_NASS_ID,
                operator: fetch_data.OPTM_OPERATOR,
                type: fetch_data.OPTM_TYPE,
                braces: fetch_data.OPTM_BRACES,
                type_value: fetch_data.OPTM_NASS_ID,
                OPTM_ASSESSMENTID: fetch_data.OPTM_NASS_ID,
                condition: fetch_data.OPTM_CONDITION,
                operand_1: fetch_data.OPTM_OP1CODE,
                operand_1_code: fetch_data.OPTM_OPERAND1,
                operand_2: fetch_data.OPTM_OP2CODE,
                operand_2_code: fetch_data.OPTM_OPERAND2,
                isTypeDisabled: type_disabled,
                is_operand1_disable: false,
                is_operand2_disable: operand2_disabled,
                row_expression: expression,
              });
              input_loop_counter++;
            
          
          console.log("seq_counter_array - ");
          console.log(seq_counter_array);

          if (data.NeedsAssessmentRuleOutput.length > 0) {
            //   let typefromdatabase: any;
            var needsAssessmentRuleOutput = [];
            needsAssessmentRuleOutput = data.NeedsAssessmentRuleOutput.filter(function (obj) {
              return obj['OPTM_SEQID'] == fetch_data.OPTM_SEQID
            });
            for (let j = 0; j < needsAssessmentRuleOutput.length; ++j) {              

              var fetch_data_output = needsAssessmentRuleOutput[j];
              //     this.seq_count = fetch_data.OPTM_SEQID;
              //     let current_count = (this.seq_count - 1);
              //     // current counter for sequence not in a direct sequence 
              //     current_count = seq_counter_array[this.seq_count];
              //     let checked_child = (fetch_data.OPTM_ISINCLUDED.trim().toLowerCase() == 'true');
              //     let default_checked = (fetch_data.OPTM_DEFAULT.trim().toLowerCase() == 'true');            

              if (this.rule_expression_data[i] != undefined) {
                this.rule_expression_data[i].output_data.push({
                  //         rowindex: i,
                  //         check_child: checked_child,
                  //         seq_number: this.seq_count,
                  //         feature: fetch_data.OPTM_FEATUREID.toString(),
                  //         featureCode: fetch_data.OPTM_FEATURECODE,
                  //         item: fetch_data.OPTM_ITEMKEY,
                  //         item_description: fetch_data.Description,
                  //         value: fetch_data.OPTM_VALUE,
                  //         uom: fetch_data.OPTM_UOM,
                  //         quantity: parseFloat(fetch_data.OPTM_QUANTITY).toFixed(3),
                  //         edit_quantity: fetch_data.OPTM_ISQTYEDIT,
                  //         price_source: fetch_data.OPTM_PRICESOURCE,
                  //         edit_price: fetch_data.OPTM_ISPRICEEDIT,
                  //         default: default_checked,
                  //         is_default: default_checked,
                  //         type: typefromdatabase
                  OPTM_MODELID: fetch_data_output.OPTM_MODELID,
                  OPTM_MODELCODE: fetch_data_output.OPTM_MODELCODE,
                  OPTM_DISPLAYNAME: fetch_data_output.OPTM_DISPLAYNAME,
                  OPTM_RULEID: fetch_data_output.OPTM_RULEID,
                  OPTM_SEQID: fetch_data_output.OPTM_SEQID,
                  OPTM_SEQUENCENO: fetch_data_output.OPTM_SEQUENCENO

                });
                //       this.rule_expression_data[current_count].output_data.filter(function (Arr) {
                //         if (Arr.price_source === "NaN") {
                //           var default_value = 0;
                //           Arr.price_source = default_value.toFixed(3);
                //           return Arr;
                //         }
                //       });
              }
            }
          }

        }
      }

          console.log(this.rule_expression_data);
          this.showLoader = false;
          // setTimeout(function () {
          //   obj.getFBOMHeader();
          //   // obj.getFeatureDetailsForOutput();
          // }, 300)
        }, error => {
          this.showLoader = false;
          if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
            this.CommonService.isUnauthorized();
          }
          return;
        })

    }
    this.showLoader = true;
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
    var dataset = this.assessmentRuleService.getAllViewDataForModelBom(search, page_number, this.record_per_page).subscribe(
      data => {

        console.log(data);
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.route, 'Sessionout');
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
          this.CommonService.isUnauthorized();
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

  on_checkbox_checked(checkedvalue, row_data) {
    var isExist = 0;
    if (this.CheckedData.length > 0) {
      for (let i = this.CheckedData.length - 1; i >= 0; --i) {
        if (this.CheckedData[i].ModelId == row_data.OPTM_MODELID) {
          isExist = 1;
          if (checkedvalue == true) {
            this.CheckedData.push({
              ModelId: row_data.OPTM_MODELID,
              OPTM_MODELCODE: row_data.OPTM_MODELCODE,
              OPTM_DISPLAYNAME: row_data.OPTM_DISPLAYNAME,
              OPTM_SEQUENCENO: 0
            })
          }
          else {
            this.CheckedData.splice(i, 1)
          }
        }
      }
      if (isExist == 0) {
        this.CheckedData.push({
          ModelId: row_data.OPTM_MODELID,
          OPTM_MODELCODE: row_data.OPTM_MODELCODE,
          OPTM_DISPLAYNAME: row_data.OPTM_DISPLAYNAME,
          OPTM_SEQUENCENO: 0
        })
      }
    }
    else {
      this.CheckedData.push({
        ModelId: row_data.OPTM_MODELID,
        OPTM_MODELCODE: row_data.OPTM_MODELCODE,
        OPTM_DISPLAYNAME: row_data.OPTM_DISPLAYNAME,
        OPTM_SEQUENCENO: 0
      })
    }

    if (this.dataArray.length == this.CheckedData.length) {
      this.commonData.checkedparentCheckbox();
    } else {
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
            ModelId: this.dataArray[i].OPTM_MODELID,
            OPTM_MODELCODE: this.dataArray[i].OPTM_MODELCODE,
            OPTM_DISPLAYNAME: this.dataArray[i].OPTM_DISPLAYNAME,
            OPTM_SEQUENCENO: 0
          })
        }
      }
    }
    else {
      this.selectall = false
    }
  }

  navigateToFeatureOrModelBom(type_value) {
    this.route.navigateByUrl("feature-bom/edit/" + type_value);
  }

  ngAfterViewInit() {
    let prpEl = document.getElementById("showOutputButton") as HTMLInputElement;
    let prpEl_ = document.getElementById("rule_code") as HTMLInputElement;
    if (this.update_id === "" || this.update_id === null) {
      prpEl_.focus();
    }
    else {
      prpEl.focus();
    }
  }

  effective_from(effective_from_date) {
    CommonData.made_changes = true;
    var temp = new Date(effective_from_date);
    let effectiveFrom = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    if (this.rule_wb_data.effective_to != null) {
      if (this.rule_wb_data.effective_to != "") {
        if (this.rule_wb_data.effective_from > this.rule_wb_data.effective_to) {
          this.CommonService.show_notification(this.language.effective_to_greater_effective_from, 'error');
          this.rule_wb_data.effective_from = this.editeffectivefrom;
          return;
        }
      }
    }
    this.rule_wb_data.effective_from = effectiveFrom;

  }

  effective_to(effective_to_date) {
    var temp = new Date(effective_to_date);
    let effectiveto = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    if (this.rule_wb_data.effective_from != null) {
      if (this.rule_wb_data.effective_from != "") {
        if (this.rule_wb_data.effective_from > this.rule_wb_data.effective_to) {
          this.CommonService.show_notification(this.language.effective_to_less_effective_from, 'error');
          this.rule_wb_data.effective_to = this.editeffectiveto;
          return;
        }
      }
    }
    this.rule_wb_data.effective_to = effectiveto;
    CommonData.made_changes = true;
  }

  copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? this.copy(v) : v;
    }
    return output;
  }

  addNewSequence() {
    CommonData.made_changes = true;
    this.add_sequence_mode = true;
    this.update_sequence_mode = false;
    if (this.validation("AddRow") == false)
      return;
    if (this.rule_expression_data.length > 0) {
      var seq_array = [];
      this.rule_expression_data.filter(function (object) {
        seq_array.push(object.seq_count);
        return object.seq_count;
      })
      this.seq_count = Math.max.apply(null, seq_array);
    } else {
      this.seq_count = 0;
    }
    this.seq_count++;
    this.onAddRow();
    this.show_sequence = true;
    this.show_add_sequence_btn = false;
    this.rule_feature_data = this.copy(this.global_rule_feature_data);
    for (let index = 0; index < this.rule_feature_data.length; index++) {
      //   let temp = this.rule_feature_data[index];
      this.rule_feature_data[index]['seq_number'] = this.seq_count;
      /// this.rule_feature_data.push(temp);
    }

    console.log(this.global_rule_feature_data);
    console.log(this.rule_feature_data);

  }

  close_rule_sequence() {

    this.show_sequence = false;
    this.show_add_sequence_btn = true;
    this.showAddSequenceBtn = false;
    this.showUpdateSequenceBtn = false;
    this.rule_sequence_data = [];
    this.generated_expression_value = "";
    this.editing_row = 0;
    this.rule_feature_data = new Array();
    this.add_sequence_mode = false;
    this.update_sequence_mode = false;
    this.isOutputTable = false;
    this.sidebarSize = "0%";
    this.resizablePanel = false;
    this.collapsiblePanelFirst = false;
    this.collapsiblePanelSecond = false;
  }

  hide_show_output() {
    CommonData.made_changes = true;
    if (this.is_showoutput_visible == 0) {
      this.is_showoutput_visible = 1;
      this.showoutput_btn_text = this.language.hide_output;
      //   this.showOutputBtn = true;
    } else {
      this.is_showoutput_visible = 0;
      this.showoutput_btn_text = this.language.show_output;
      //  this.showOutputBtn = false;

    }
  }
  openAssessmentLookUp(dataItem, rowindex) {
    this.serviceData = []
    this.showLookupLoader = true;
    this.currentrowindex = rowindex;
    this.assessmentService.GetNeedsAssessmentList().subscribe(
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
          this.lookupfor = 'assessment_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
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

  validateForAddRow() {
    let isValid = true
    this.rule_sequence_data.forEach(element => {
      if (element.OPTM_ASSESSMENTID == "" || element.OPTM_ASSESSMENTID == null) {
        this.CommonService.show_notification(this.language.NOOPTM_ASSESSMENTID + " " + element.seq_count, 'error');
        isValid = false;
        return isValid;
      }
      else if (element.operand_1 == "" || element.operand_1 == null) {
        this.CommonService.show_notification(this.language.Nooperand_1 + " " + element.seq_count, 'error');
        isValid = false;
        return isValid;
      }
      else if (element.condition == "" || element.condition == null) {
        this.CommonService.show_notification(this.language.Notype + " " + element.seq_count, 'error');
        isValid = false;
        return isValid;
      }
    });
    return isValid;
  }

  onAddRow() {
    if (this.validation("AddRow") == false)
      return;
    this.counter = 0;
    if (this.rule_sequence_data.length > 0) {
      if (!this.validateForAddRow()) {
        return;
      }
      this.counter = this.rule_sequence_data.length
    }
    this.counter++;
    this.sidebarSize = "25%";
    this.resizablePanel = true;
    this.collapsiblePanelFirst = true;
    this.collapsiblePanelSecond = true;
    this.rule_sequence_data.push({
      lineno: this.counter,
      rowindex: this.counter,
      seq_count: this.seq_count,
      operator: '',
      type: '',
      braces: '',
      OPTM_ASSESSMENTID: "",
      condition: '',
      operand_1: '',
      operand_2: '',
      operand_1_code: "",
      operand_2_code: "",
      isTypeDisabled: true,
      is_operand1_disable: true,
      is_operand2_disable: true,
      row_expression: ''
    });
    CommonData.made_changes = true; 
  }

  getFetureListLookup(status) {
    CommonData.made_changes = true;
    console.log('inopen feature');
    this.showLookupLoader = true;
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.service.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }

          this.serviceData = data;
          this.showLookupLoader = false;
          console.log(this.serviceData);

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
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

  getLookupValue($event) {
    for (let i = 0; i < this.rule_sequence_data.length; ++i) {
      if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
        if (this.lookupfor == 'feature_Detail_lookup' || this.lookupfor == 'ModelBom_lookup') {
          this.rule_sequence_data[i]['operand_1'] = '';
          this.rule_sequence_data[i]['operand_1_code'] = '';
          this.rule_sequence_data[i]['operand_2'] = '';
          this.rule_sequence_data[i]['operand_2_code'] = '';
        }

        if (this.rule_sequence_data[i]['type'] == 1) {
          //   this.rule_sequence_data[i]['condition'] = '';
          if (this.rule_sequence_data[i]['condition'] != "Between") {
            this.rule_sequence_data[i]['is_operand2_disable'] = true;
          }
        } else {
          //    this.rule_sequence_data[i]['condition'] = '';
          this.rule_sequence_data[i]['is_operand2_disable'] = true;

        }
      }
    }

    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }

    if (this.lookupfor == 'feature_lookup') {
      this.rule_wb_data.applicable_for_feature_id = $event[0];
      this.rule_wb_data.applicable_for_feature_code = $event[1];
      this.getFBOMHeader();
      // this.getFeatureDetailsForOutput();
    }
    if (this.lookupfor == 'assessment_lookup') {

      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
          this.rule_sequence_data[i].OPTM_ASSESSMENTID = $event[0].toString();
          this.rule_sequence_data[i].OPTM_QUESTION = $event[1].toString();
          this.rule_sequence_data[i].type_value = $event[0].toString();
          this.rule_sequence_data[i].type_value_code = $event[0].toString();
          this.rule_sequence_data[i]['is_operand1_disable'] = false;
        }
      }
    }
    if (this.lookupfor == 'ModelBom_lookup') {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        //Bug no. 18355,18333...13-Nov-18...Ashish 
        if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
          this.rule_sequence_data[i].type_value = $event[0].toString();
          this.rule_sequence_data[i].type_value_code = $event[1].toString();
        }
      }
    }
    if (this.lookupfor == 'operand_feature_lookup' || this.lookupfor == 'operand_model_lookup') {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
          if (this.operand_type == 'operand_1') {
            this.rule_sequence_data[i].operand_1 = $event[1];
            this.rule_sequence_data[i].operand_1_code = $event[1];
          } else if (this.operand_type == 'operand_2') {
            this.rule_sequence_data[i].operand_2 = $event[1];
            this.rule_sequence_data[i].operand_2_code = $event[1];
          }
        }
      }
      this.operand_type = "";
    }

  }

  getFeatureDetails(feature_code, press_location, index) {
    this.showLookupLoader = true;
    console.log('inopen feature');
    this.serviceData = []
    //this.lookupfor = 'feature_lookup';
    this.service.getFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
          if (press_location == "Detail") {
            if (index == 1) {
              this.lookupfor = 'feature_Detail_lookup';
            }
            this.serviceData = data;
          }
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
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
    if (this.rule_sequence_data.length > 0) {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === rowindex) {
          this.rule_sequence_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.rule_sequence_data[i].rowindex = i + 1;
        }
      }
    }
  }

  getFBOMHeader() {
    this.showLookupLoader = true;
    this.feature_bom_header_details = [];
    this.service.getFeatureBOMHeader(this.rule_wb_data.applicable_for_feature_id).subscribe(
      data => {
        if (data != null && data != "" && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              CommonData.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.route, 'Sessionout');
              return;
            }
          }
          if (data.FBOMDTL.length > 0) {
            this.feature_bom_header_details = data.FBOMDTL[0];
            this.getFeatureDetailsForOutput();
          } else {
            this.showLookupLoader = false;
            this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
            return;
          }
        }
      }, error => {
        this.feature_bom_header_details = [];
        this.showLookupLoader = false;
        this.rule_wb_data.applicable_for_feature_id = '';
        this.rule_wb_data.applicable_for_feature_code = '';
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }
    )
  }

  getFeatureDetailsForOutput() {
    this.close_rule_sequence();
    this.rule_feature_data = new Array();
    //this.outputrowcounter=0;
    this.showLookupLoader = true;
    this.global_rule_feature_data = new Array();
    this.service.getFeatureDetailsForOutput(this.rule_wb_data.applicable_for_feature_id).subscribe(
      data => {
        if (data != null && data != "" && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              CommonData.made_changes = false;
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.route, 'Sessionout');
              return;
            }
          }
          for (let i = 0; i < data.length; ++i) {
            this.outputrowcounter++;
            if (data[i].PriceSource == null || data[i].PriceSource == undefined || data[i].PriceSource == "NaN" || data[i].PriceSource == "") {
              data[i].PriceSource = ""
            }
            else {
              data[i].PriceSource = parseFloat(data[i].PriceSource).toFixed(3)
            }

            let default_value = false;
            console.log(" this.feature_bom_header_details  ", this.feature_bom_header_details);
            if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'N') {
              if (this.feature_bom_header_details.OPTM_MIN_SELECTABLE == 0) {
                default_value = false;
              } else if (this.feature_bom_header_details.OPTM_MIN_SELECTABLE == 1) {
                if (data[i].Default == 'Y') {
                  default_value = true;
                } else {
                  default_value = false;
                }
              }
            } else if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'Y') {
              if (data[i].Default == 'Y') {
                default_value = true;
              } else {
                default_value = false;
              }
            } else if (this.feature_bom_header_details.OPTM_ISMULTISELECT == null) {
              if (data[i].Default == 'Y') {
                default_value = true;
              } else {
                default_value = false;
              }
            }

            this.global_rule_feature_data.push({
              rowindex: i,
              check_child: true,
              feature: data[i].Feature.toString(),
              featureCode: data[i].featureCode,
              item: data[i].Item,
              item_description: data[i].DisplayName,
              value: data[i].Value,
              uom: data[i].UOM,
              quantity: parseFloat(data[i].Quantity).toFixed(3),
              edit_quantity: "n",
              price_source: data[i].PriceSource,
              edit_price: "n",
              default: default_value,
              is_default: default_value,
              type: data[i].type

            });
          }
        }
        this.showLookupLoader = false;
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      }

    )
  }

  validate_brackets(sequence) {
    let string_holder = []
    let open_braces = ['(', '{', '[']
    let closed_braces = [')', '}', ']']
    for (let letter of sequence) {
      if (open_braces.includes(letter)) {
        string_holder.push(letter);
      } else if (closed_braces.includes(letter)) {
        let openPair = open_braces[closed_braces.indexOf(letter)];
        if (string_holder[string_holder.length - 1] === openPair) {
          string_holder.splice(-1, 1);
        } else {
          string_holder.push(letter)
          break;
        }
      }
    }
    return (string_holder.length === 0) // return true if length is 0, otherwise false
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async  genearate_expression() {
    this.assesment_ID = "";
    CommonData.made_changes = true;
    await this.sleep(700);
    let current_seq = this.seq_count;
    console.log(current_seq);

    let seq_data = this.rule_sequence_data.filter(function (obj) {
      return obj['seq_count'] == current_seq;
    });
    let current_exp = '';
    let assessment_code = "";

    let brackes_category = { "open": ['{', '(', '['], "close": ['}', ')', ']'] };
    for (var index in seq_data) {

      let operator = (seq_data[index].operator != "" && seq_data[index].operator !== undefined) ? seq_data[index].operator : "";
      let braces = (seq_data[index].braces != "" && seq_data[index].braces !== undefined) ? seq_data[index].braces : "";
      let type = (seq_data[index].type != "" && seq_data[index].type !== undefined) ? seq_data[index].type : "";
      let type_value_code = (seq_data[index].type_value_code != "" && seq_data[index].type_value_code !== undefined) ? seq_data[index].type_value_code : "";
      let condition = (seq_data[index].condition != "" && seq_data[index].condition !== undefined) ? seq_data[index].condition : "";
      let operand_1 = (seq_data[index].operand_1 != "" && seq_data[index].operand_1 !== undefined) ? seq_data[index].operand_1 : "";
      let operand_2 = (seq_data[index].operand_2 != "" && seq_data[index].operand_2 !== undefined) ? seq_data[index].operand_2 : "";
      let operand_1_code = (seq_data[index].operand_1_code != "" && seq_data[index].operand_1_code !== undefined) ? seq_data[index].operand_1_code : "";
      let operand_2_code = (seq_data[index].operand_2_code != "" && seq_data[index].operand_2_code !== undefined) ? seq_data[index].operand_2_code : "";


      if (index != "0") {
        if (type != "" && operator == "") {
          this.generated_expression_value = "";
          this.CommonService.show_notification(this.language.operator_cannotbe_blank_with_type + (parseInt(index) + 1), 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;
          return false;
        }
      }

      if (index == "0") {
        if (operator != "") {
          this.generated_expression_value = "";
          this.CommonService.show_notification(this.language.operator_row_1_error, 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;

          return false;
        }
      }

      if (type_value_code != "") {
        if (condition == "") {
          this.CommonService.show_notification(this.language.required_fields + (parseInt(index) + 1) + " - " + this.language.condition, 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;
          return false;
        }

        if (operand_1_code == "" && type == 1) {
          this.CommonService.show_notification(this.language.required_fields + (parseInt(index) + 1) + " - " + this.language.operand_1, 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;
          return false;
        }


      }

      if (type != "") {

        if (type == "" || type_value_code == "" || condition == "" || (operand_1_code == "" && type == 1)) {

          let error_fields = '';
          if (type == "") {
            if (error_fields != "") {
              error_fields += ", ";
            }
            error_fields += " " + this.language.type;
          }

          if (type_value_code == "") {
            if (error_fields != "") {
              error_fields += ", ";
            }
            error_fields += " " + this.language.model_feature;
          }

          if (condition == "") {
            if (error_fields != "") {
              error_fields += ", ";
            }
            error_fields += " " + this.language.condition;
          }

          if (operand_1_code == "" && type == 1) {
            if (error_fields != "") {
              error_fields += ", ";
            }
            error_fields += " " + this.language.operand_1;
          }
          this.generated_expression_value = "";
          this.CommonService.show_notification(this.language.required_fields + (parseInt(index) + 1) + " - " + error_fields, 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;
          return false;
        }

        if (condition == "Between" && operand_2 == "" && type == 1) {
          this.generated_expression_value = "";
          this.CommonService.show_notification(this.language.required_fields + (parseInt(index) + 1) + " - " + this.language.operand_2, 'error');
          this.showAddSequenceBtn = false;
          this.showUpdateSequenceBtn == false;
          return false;
        }

      }

      let operand = operand_1_code;
      if (operand_2 != "") {
        operand = operand_1_code + ' and ' + operand_2_code;
      }

      if (operator !== "" && brackes_category['close'].indexOf(braces) !== -1) {
        this.generated_expression_value = "";
        this.CommonService.show_notification(this.language.illogical_expression_error, 'error');
        this.showAddSequenceBtn = false;
        this.showUpdateSequenceBtn == false;
        return false;
      }
      if (type == 2) {
        this.rule_sequence_data[index].row_expression = operator + ' ' + braces + ' ' + seq_data[index].OPTM_ASSESSMENTID + ' ' + condition + ' ' + type_value_code;

      } else {
        this.rule_sequence_data[index].row_expression = operator + ' ' + braces + ' ' + seq_data[index].OPTM_ASSESSMENTID + ' ' + condition + ' ' + operand;
      }


      current_exp += " " + seq_data[index].row_expression;

    }
    if (this.validate_brackets(current_exp)) {
    } else {
      this.generated_expression_value = "";
      this.CommonService.show_notification(this.language.invalid_expression_bracket_error, 'error');
      this.showAddSequenceBtn = false;
      this.showUpdateSequenceBtn == false;
      return false;

    }

    if (current_exp.trim() != "") {

      this.generated_expression_value = current_exp;
      if (this.add_sequence_mode == true) {
        this.showAddSequenceBtn = true;
      } else if (this.update_sequence_mode == true) {
        this.showUpdateSequenceBtn = true;
      }


    }

  }

  on_input_change(rowindex, key, value, actualvalue) {
    CommonData.made_changes = true;
    this.currentrowindex = rowindex;
    for (let i = 0; i < this.rule_sequence_data.length; ++i) {
      if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
        this.rule_sequence_data[i][key] = value;
        this.generated_expression_value = '';
        if (this.add_sequence_mode == true) {
          this.showAddSequenceBtn = false;
        } else if (this.update_sequence_mode == true) {
          this.showUpdateSequenceBtn = false;
        }
        console.log("key - " + key);
        console.log("value - " + value);
        console.log("rowindex - " + rowindex);
        console.log(actualvalue);
        if (key == 'type') {
          this.rule_sequence_data[i]['operand_1'] = '';
          this.rule_sequence_data[i]['operand_1_code'] = '';
          this.rule_sequence_data[i]['operand_2'] = '';
          this.rule_sequence_data[i]['operand_2_code'] = '';
          this.rule_sequence_data[i]['condition'] = '';
          this.rule_sequence_data[i]['type_value'] = '';
          this.rule_sequence_data[i]['type_value_code'] = '';
          //  $("#type_value_code").val("");
          //  $("#type_value").val("");
          this.rule_sequence_data[i]['is_operand2_disable'] = true;
          if (value == 2) {
            this.rule_sequence_data[i]['is_operand1_disable'] = true;
            this.rule_sequence_data[i]['isTypeDisabled'] = false;
            this.rule_sequence_data[i]['condition'] = '=';
          } else if (value == 1) {
            this.rule_sequence_data[i]['is_operand1_disable'] = false;
            this.rule_sequence_data[i]['isTypeDisabled'] = false;
          } else {
            this.rule_sequence_data[i]['is_operand1_disable'] = true;
            this.rule_sequence_data[i]['isTypeDisabled'] = true;
          }
        }
        if (key == "condition") {
          if (value == "Between") {
            if (this.rule_sequence_data[i].type == 1) {
              this.rule_sequence_data[i]['is_operand2_disable'] = false;
            } else {
              this.rule_sequence_data[i]['is_operand2_disable'] = true;
            }
          } else {
            this.rule_sequence_data[i]['is_operand2_disable'] = true;
            this.rule_sequence_data[i]['operand_2'] = '';
            this.rule_sequence_data[i]['operand_2_code'] = '';
          }
        }
        if (key === 'type_value') {
          this.rule_sequence_data[i]['operand_1'] = '';
          this.rule_sequence_data[i]['operand_1_code'] = '';
          this.rule_sequence_data[i]['operand_2'] = '';
          this.rule_sequence_data[i]['operand_2_code'] = '';

          this.rule_sequence_data[i]['is_operand2_disable'] = true;
          console.log("type - " + this.rule_sequence_data[i].type);
          if (this.rule_sequence_data[i].type == 1) {
            this.rule_sequence_data[i]['condition'] = '';
            this.rule_sequence_data[i]['is_operand1_disable'] = false;
            this.service.onFeatureIdChange(this.rule_sequence_data[i].type_value).subscribe(
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
                  this.CommonService.show_notification(this.language.InvalidFeatureId, 'error');
                  // $(actualvalue).val("");
                  return;
                }
                else {
                  this.rule_sequence_data[i].type_value = data;
                  this.rule_sequence_data[i].type_value_code = value;
                }
              }, error => {
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                  this.CommonService.isUnauthorized();
                }
                return;
              });
          } else if (this.rule_sequence_data[i].type == 2) {
            this.rule_sequence_data[i]['is_operand1_disable'] = true;
            this.service.onModelIdChange(this.rule_sequence_data[i].type_value).subscribe(
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
                  this.CommonService.show_notification(this.language.InvalidModelId, 'error');

                  actualvalue.value = "";
                  return;
                }
                else {
                  this.rule_sequence_data[i].type_value = data;
                  this.rule_sequence_data[i].type_value_code = value;
                }
              }, error => {
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                  this.CommonService.isUnauthorized();
                }
                return;
              });
          }
        }

        if (key === 'operand_1_code' || key === 'operand_2_code') {
          if (this.rule_sequence_data[i].type == 1) {
            this.service.onChildFeatureIdChange(this.rule_sequence_data[i].type, this.rule_sequence_data[i].type_value, value).subscribe(
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
                  if (key == "operand_1_code") {
                    this.CommonService.show_notification(this.language.InvalidOperand1, 'error');
                    this.rule_sequence_data[i]['operand_1'] = '';
                    this.rule_sequence_data[i]['operand_1_code'] = '';
                  }
                  if (key == "operand_2_code") {
                    this.CommonService.show_notification(this.language.InvalidOperand2, 'error');
                    this.rule_sequence_data[i]['operand_2'] = '';
                    this.rule_sequence_data[i]['operand_2_code'] = '';
                  }

                  actualvalue.value = "";
                  return;
                }
                else {
                  if (key == "operand_1_code") {
                    this.rule_sequence_data[i]['operand_1'] = data;
                    this.rule_sequence_data[i]['operand_1_code'] = value;
                  }
                  if (key == "operand_2_code") {
                    this.rule_sequence_data[i]['operand_2'] = data;
                    this.rule_sequence_data[i]['operand_2_code'] = value;
                  }

                }
              }, error => {
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                  this.CommonService.isUnauthorized();
                }
                return;
              });
          }

          else {
            this.service.onChildModelIdChange(this.rule_sequence_data[i].type, this.rule_sequence_data[i].type_value, value).subscribe(
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
                  this.CommonService.show_notification(this.language.InvalidModelId, 'error');
                  actualvalue.value = "";
                  return;
                }
                else {
                  this.rule_sequence_data[i].type_value = data;
                }
              }, error => {
                if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
                  this.CommonService.isUnauthorized();
                }
                return;
              });
          }
        }
        console.log(this.rule_sequence_data[i]);
      }
    }
  }

  getModelDetails() {
    this.showLookupLoader = true;
    this.serviceData = [];
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.showLookupLoader = false;
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
          this.serviceData = data;
        }
      }, error => {
        this.showLookupLoader = false;
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  show_operand_lookup(type, type_value, rowindex, operand_value) {
    CommonData.made_changes = true;
    this.showLookupLoader = true;
    this.assessmentRuleService.get_model_feature_options(type_value).subscribe(
      data => {
        this.showLookupLoader = false;


        if (data.length > 0) {
          console.log(data);
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
          this.currentrowindex = rowindex;
          this.lookupfor = "operand_model_lookup";
          this.operand_type = operand_value;
          this.serviceData = data;

        } else {
          this.lookupfor = "";
          this.serviceData = [];
          this.CommonService.show_notification(this.language.NoDataAvailable, 'error');
          return;
        }
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  show_input_lookup(selected_type, rowindex) {
    this.currentrowindex = rowindex

    if (selected_type == 1) {
      this.getFeatureDetails(this.rule_wb_data.applicable_for_feature_id, "Detail", selected_type);
    }
    else {
      this.getModelDetails();
    }
  }

  on_typevalue_change(value, rowindex, actualvalue) {
    // apply validation 
    CommonData.made_changes = true;
    this.on_input_change(rowindex, 'type_value', value, actualvalue);
  }

  add_rule_sequence() {
    CommonData.made_changes = true;
    if (this.rule_sequence_data.length > 0) {
      this.expression_counter = 0;
      if (this.rule_expression_data.length > 0) {
        this.expression_counter = this.rule_expression_data.length
      }

      // additional validation for atleast 1 option selected as default in output
      var feature_data_default_value = this.rule_feature_data.filter(function (obj) {
        return obj.is_default;
      });
      console.log("feature_data_default_value");
      console.log(feature_data_default_value);

      if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'N' && this.feature_bom_header_details.OPTM_MIN_SELECTABLE != '0' && this.isExcluded == false) {
        if (feature_data_default_value.length == 0 || feature_data_default_value == null || feature_data_default_value == undefined) {
          this.CommonService.show_notification(this.language.one_default_required, 'error');
          return false;
        }
      } else if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'Y') {
        if (feature_data_default_value.length > this.feature_bom_header_details.OPTM_MAX_SELECTABLE) {
          this.CommonService.show_notification(this.language.default_more_than_max_sel + ' - ' + this.feature_bom_header_details.OPTM_MAX_SELECTABLE, 'error');
          return false;
        }
      }
      for (let i = 0; i < this.CheckedData.length; ++i) {
        this.rule_feature_data.push({
          OPTM_RULEID: this.rule_wb_data.RuleId,
          OPTM_SEQID: this.rule_sequence_data[0].seq_count,
          OPTM_MODELID: this.CheckedData[i].ModelId,
          OPTM_MODELCODE: this.CheckedData[i].OPTM_MODELCODE,
          OPTM_DISPLAYNAME: this.CheckedData[i].OPTM_DISPLAYNAME,
          OPTM_SEQUENCENO: this.CheckedData[i].OPTM_SEQUENCENO
        });
      }
      this.CheckedData = []
      this.selectall = false
      this.commonData.clearChildCheckbox();
      this.expression_counter++;
      this.rule_expression_data.push({
        rowindex: this.expression_counter,
        seq_count: this.rule_sequence_data[0].seq_count,
        expression: this.generated_expression_value,
        row_data: this.rule_sequence_data,
        output_data: this.rule_feature_data
      });
      this.CommonService.show_notification(this.language.expression_generated, 'success');
      this.close_rule_sequence();
      console.log(this.rule_expression_data);
    }
    else {
      this.CommonService.show_notification(this.language.sequence_row_empty, 'error');
    }
  }

  onFeatureIdChange(feature_id_code) {
    this.showLookupLoader = true;
    this.service.onFeatureIdChange(feature_id_code).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data === "False") {
          this.CommonService.show_notification(this.language.InvalidFeatureCode, 'error');
          this.rule_wb_data.applicable_for_feature_id = "";
          this.rule_wb_data.applicable_for_feature_code = "";
          return;
        }
        else {
          this.lookupfor = 'feature_lookup';
          this.rule_wb_data.applicable_for_feature_id = data;
          this.getFBOMHeader();
          // this.getFeatureDetailsForOutput();
        }
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  update_rule_sequence() {
    CommonData.made_changes = true;
    if (this.rule_sequence_data.length > 0) {
      // additional validation for atleast 1 option selected as default in output
      var feature_data_default_value = this.rule_feature_data.filter(function (obj) {
        return obj.is_default;
      });
      if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'N' && this.feature_bom_header_details.OPTM_MIN_SELECTABLE != '0' && this.isExcluded == false) {
        if (feature_data_default_value.length == 0 || feature_data_default_value == null || feature_data_default_value == undefined) {
          this.CommonService.show_notification(this.language.one_default_required, 'error');
          return false;
        }
      } else if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'Y') {
        if (feature_data_default_value.length > this.feature_bom_header_details.OPTM_MAX_SELECTABLE) {
          this.CommonService.show_notification(this.language.default_more_than_max_sel, 'error');
          return false;
        }
      }

      let row_auto_index: any = '';
      let seqId: any = '';
      for (let i = 0; i < this.rule_expression_data.length; ++i) {
        if (this.rule_expression_data[i].rowindex === this.editing_row) {
          row_auto_index = i;
          seqId = this.rule_expression_data[i].seq_count;
        }
      }
      this.rule_feature_data = this.rule_feature_data.filter(function (obj) {
        return obj['OPTM_SEQID'] != seqId
      });

      for (let i = 0; i < this.CheckedData.length; ++i) {
        this.rule_feature_data.push({
          OPTM_RULEID: this.rule_wb_data.RuleId,
          OPTM_SEQID: seqId,
          OPTM_MODELID: this.CheckedData[i].ModelId,
          OPTM_MODELCODE: this.CheckedData[i].OPTM_MODELCODE,
          OPTM_DISPLAYNAME: this.CheckedData[i].OPTM_DISPLAYNAME,
          OPTM_SEQUENCENO:this.CheckedData[i].OPTM_SEQUENCENO
        });
      }
      this.CheckedData = []
      this.selectall = false
      this.commonData.clearChildCheckbox();
      this.rule_expression_data[row_auto_index]['rowindex'] = this.editing_row;
      this.rule_expression_data[row_auto_index]['seq_count'] = this.rule_sequence_data[0].seq_count;
      this.rule_expression_data[row_auto_index]['expression'] = this.generated_expression_value;
      this.rule_expression_data[row_auto_index]['row_data'] = this.rule_sequence_data;
      this.rule_expression_data[row_auto_index]['output_data'] = this.rule_feature_data;
      this.CommonService.show_notification(this.language.expression_updated, 'success');
      this.close_rule_sequence();
    } else {
      this.CommonService.show_notification(this.language.sequence_row_empty, 'error');
    }
  }

  edit_expression(row, rowindex) {
    CommonData.made_changes = true;
    this.add_sequence_mode = false;
    this.update_sequence_mode = true;
    this.rule_sequence_data = [];
    this.commonData.clearChildCheckbox();
    this.sidebarSize = "25%";
    this.resizablePanel = true;
    this.collapsiblePanelFirst = true;
    this.collapsiblePanelSecond = true;
    if (row.row_data.length > 0) {
      let edit_expression_data = row.row_data;
      for (var data in edit_expression_data) {
        this.rule_sequence_data.push(edit_expression_data[data]);
      }

      // output section 
      this.rule_feature_data = new Array();
      let feature_rule_data = row.output_data;
      for (var data in feature_rule_data) {
        this.rule_feature_data.push(feature_rule_data[data]);
      }
      for (let i = 0; i < this.rule_feature_data.length; i++) {
        this.CheckedData.push({
          ModelId: this.rule_feature_data[i].OPTM_MODELID,
          OPTM_MODELCODE: this.rule_feature_data[i].OPTM_MODELCODE,
          OPTM_DISPLAYNAME: this.rule_feature_data[i].OPTM_DISPLAYNAME,
          OPTM_SEQUENCENO: this.rule_feature_data[i].OPTM_SEQUENCENO
        })
        this.checkedChildCheckbox(this.rule_feature_data[i].OPTM_MODELID);
      }

      //  if (this.rule_wb_data.Excluded) {
      //    this.isExcluded = true;
      //    this.selectall = false;
      //    for (let i = 0; i < this.rule_feature_data.length; i++) {
      //      this.rule_feature_data[i].check_child = false;
      //    }
      //  } else {
      //    this.isExcluded = false;
      //  }

      this.generated_expression_value = row.expression;
      this.editing_row = rowindex;
      this.seq_count = row.seq_count;

      this.show_sequence = true;
      this.show_add_sequence_btn = false;
      this.showAddSequenceBtn = false;
      this.showUpdateSequenceBtn = true;
    }
  }

  public checkedChildCheckbox(ModelId) {
    let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
    if (child_checkbox_selector.length > 0) {
      for (let i = 0; i < child_checkbox_selector.length; i++) {
        if (this.dataArray[i].OPTM_MODELID == ModelId)
          child_checkbox_selector[i].checked = true;
      }
    }
  }

  delete_expression(rowindex) {
    CommonData.made_changes = true;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    this.row_id = rowindex;
  }

  delete_row() {
    CommonData.made_changes = true;
    if (this.rule_expression_data.length > 0) {
      for (let i = 0; i < this.rule_expression_data.length; ++i) {
        if (this.rule_expression_data[i].rowindex === this.row_id) {
          this.rule_expression_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.rule_expression_data[i].rowindex = i + 1;
        }
      }
    }
    this.seq_count--;
    if (this.seq_count < 0) {
      this.seq_count = 0;
    }
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    CommonData.made_changes = true;
    if (userSelectionValue == true) {
      this.delete_row();
    }
    this.show_dialog = false;
  }


  output_change_event(name, value, rowindex) {
    CommonData.made_changes = true;
    for (let i = 0; i < this.rule_feature_data.length; ++i) {
      if (this.rule_feature_data[i].rowindex == rowindex) {
        if (name == "check_child") {
          this.rule_feature_data[i].check_child = value
          if (value == false) {
            this.rule_feature_data[i].default = value
            this.rule_feature_data[i].is_default = value
          }
        }
        else if (name == "feature_name") {
          this.rule_feature_data[i].feature = value
        }
        else if (name == "feature_item") {
          this.rule_feature_data[i].item = value
        } else if (name == "feature_item_description") {
          this.rule_feature_data[i].item_description = value
        }
        else if (name == "feature_value") {
          this.rule_feature_data[i].value = value
        }
        else if (name == "uom") {
          this.rule_feature_data[i].uom = value
        }
        else if (name == "quantity") {
          this.rule_feature_data[i].quantity = parseFloat(value).toFixed(3)
        }
        else if (name == "edit_quanity") {
          this.rule_feature_data[i].edit_quantity = value
        }
        else if (name == "price_soure") {
          this.rule_feature_data[i].price_source = value
        }
        else if (name == "edit_price") {
          this.rule_feature_data[i].edit_price = value
        }
        else if (name == "default") {
          if (this.feature_bom_header_details.OPTM_ISMULTISELECT == 'N') {
            this.rule_feature_data.forEach(function (data) {
              data.default = false;
              data.is_default = false;
            });
          }

          this.rule_feature_data[i].default = value
          this.rule_feature_data[i].is_default = value

          console.log(this.rule_feature_data);
        }
      }
    }

  }

  check_all(value) {
    CommonData.made_changes = true;
    for (let i = 0; i < this.rule_feature_data.length; ++i) {
      this.rule_feature_data[i].check_child = value;
      if (value == false) {
        this.rule_feature_data[i].default = value;
        this.rule_feature_data[i].is_default = value;
      }
    }

    this.selectall = true;
  }

  excludeAllRowsOnCheck() {
    CommonData.made_changes = true;
    if (this.rule_wb_data.Excluded) {
      this.isExcluded = true;
      for (var i = 0; i < this.rule_feature_data.length; i++) {
        this.rule_feature_data[i].check_child = false;
        this.rule_feature_data[i].default = false;
        this.rule_feature_data[i].is_default = false;
      }
      this.selectall = false;
    } else {
      this.isExcluded = false;
    }
  }

  validation(btnpress) {
    if (btnpress == "AddRow") {
      if (this.rule_wb_data.rule_code == "" || this.rule_wb_data.rule_code == null) {
        this.CommonService.show_notification(this.language.selectrulecode, 'error');
        return false;
      }

      if (this.rule_wb_data.effective_from == "" || this.rule_wb_data.effective_from == null) {
        this.CommonService.show_notification(this.language.selecteffromdate, 'error');
        return false;
      }
      if (this.rule_wb_data.discontinued == true) {
        if (this.rule_wb_data.effective_to == "" || this.rule_wb_data.effective_to == null) {
          this.CommonService.show_notification(this.language.selectefftodate, 'error');
          return false;
        }
      }
      //  if (this.rule_wb_data.applicable_for_feature_id == "" || this.rule_wb_data.applicable_for_feature_id == null) {
      //    this.CommonService.show_notification(this.language.FeatureCodeBlank, 'error');
      //    return false;
      //  }
      if (new Date(this.rule_wb_data.effective_to) < new Date(this.rule_wb_data.effective_from)) {
        this.CommonService.show_notification(this.language.DateValidation, 'error');
        return false;
      }
    }
    else if (btnpress == "Save") {

      if (this.rule_wb_data.rule_code == "" || this.rule_wb_data.rule_code == null) {
        this.CommonService.show_notification(this.language.selectrulecode, 'error');
        return false;
      }

      if (this.rule_wb_data.effective_from == "" || this.rule_wb_data.effective_from == null) {
        this.CommonService.show_notification(this.language.selecteffromdate, 'error');
        return false;
      }
      if (this.rule_expression_data.length == 0) {
        this.CommonService.show_notification(this.language.Nodataforsave, 'error');
        return false;
      }
    }
    else {
      if (this.rule_sequence_data.length > 0) {
        for (let i = 0; i < this.rule_sequence_data.length; ++i) {
          let currentrow = i + 1;
          if (this.rule_sequence_data[i].operator == "" || this.rule_sequence_data[i].operator == '' || this.rule_sequence_data[i].operator == null) {
            this.CommonService.show_notification(this.language.selectoperator + currentrow, 'error');
            return false;
          }
          if (this.rule_sequence_data[i].braces == "" || this.rule_sequence_data[i].braces == '' || this.rule_sequence_data[i].braces == null) {
            this.CommonService.show_notification(this.language.selectbraces + currentrow, 'error');
            return false;
          }
          if (this.rule_sequence_data[i].type_value == "" || this.rule_sequence_data[i].type_value == '' || this.rule_sequence_data[i].type_value == null) {
            if (this.rule_sequence_data[i].type == 1) {
              this.CommonService.show_notification(this.language.SelectFeature + currentrow, 'error');
              return false;
            }
            else {
              this.CommonService.show_notification(this.language.SelectModel + currentrow, 'error');
              return false;
            }

          }
          if (this.rule_sequence_data[i].condition == "" || this.rule_sequence_data[i].condition == '' || this.rule_sequence_data[i].condition == null) {
            this.CommonService.show_notification(this.language.selectcondition + currentrow, 'error');
            return false;
          }
          if (this.rule_sequence_data[i].operand_1 == "" || this.rule_sequence_data[i].operand_1 == '' || this.rule_sequence_data[i].operand_1 == null) {
            this.CommonService.show_notification(this.language.selectoperand1 + currentrow, 'error');
            return false;
          }
          if (this.rule_sequence_data[i].operand_2 == "" || this.rule_sequence_data[i].operand_2 == '' || this.rule_sequence_data[i].operand_2 == null) {
            this.CommonService.show_notification(this.language.selectoperand2 + currentrow, 'error');
            return false;
          }

        }

      }
    }
    return true;
  }

  onSave() {
    if (this.validation("Save") == false)
      return;

    if (this.isDuplicateMode) {
      this.NewRuleId = "";
      this.rule_wb_data.RuleId = "";
    }
    else {
      if (this.update_id == null) {
        this.NewRuleId = "";
      }
      else {
        this.NewRuleId = this.update_id;
      }

    }


    if (this.rule_expression_data.length > 0) {
      this.showLookupLoader = true;
      let single_data_set: any = {};
      single_data_set.OPCONFIG_NS_RWB_HEADER = [];
      single_data_set.OPCONFIG_NS_RWB_OUTPUT = [];
      single_data_set.OPCONFIG_NS_RWB_INPUT = [];
      single_data_set.OPCONFIG_NS_RWB_HEADER.push({
        id: this.NewRuleId,
        OPTM_RULECODE: this.rule_wb_data.rule_code,
        description: this.rule_wb_data.description,
        effective_from: this.rule_wb_data.effective_from,
        effective_to: this.rule_wb_data.effective_to,
        discontinue: this.rule_wb_data.discontinued,
        excluded: this.rule_wb_data.Excluded,
        CreatedUser: this.rule_wb_data.username,
        applicablefor: this.rule_wb_data.applicable_for_feature_id,
        CompanyDBId: this.rule_wb_data.CompanyDBId,
        RuleId: this.rule_wb_data.RuleId

      })
      //  single_data_set.single_data_set_output = this.rule_feature_data
      let extracted_sequences: any = [];
      let extracted_output: any = [];
      for (var key in this.rule_expression_data) {
        for (var rowkey in this.rule_expression_data[key].row_data) {
          extracted_sequences.push(this.rule_expression_data[key].row_data[rowkey]);
        }

        for (var rowkey in this.rule_expression_data[key].output_data) {
          extracted_output.push(this.rule_expression_data[key].output_data[rowkey]);
        }
      }
      single_data_set.OPCONFIG_NS_RWB_INPUT = extracted_sequences;
      single_data_set.OPCONFIG_NS_RWB_OUTPUT = extracted_output
      this.assessmentRuleService.SaveData(single_data_set).subscribe(
        data => {
          this.showLookupLoader = false;
          if (data == "7001") {
            CommonData.made_changes = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }

          if (data === "True") {
            CommonData.made_changes = false;
            this.CommonService.show_notification(this.language.DataSaved, 'success');
            this.route.navigateByUrl('need-assessment-rule/view');
            return;
          }
          else if (data === "AlreadyExist") {
            this.CommonService.show_notification(this.language.DuplicateCode, 'error');
            return;
          }
          else {
            this.CommonService.show_notification(this.language.DataNotSaved, 'error');
            return;
          }
        }, error => {
          this.showLookupLoader = false;
          if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
            this.CommonService.isUnauthorized();
          }
          return;
        })
    }
  }

}
