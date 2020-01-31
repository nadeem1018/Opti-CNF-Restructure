import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from 'src/app/core/data/CommonData';
import { FormGroup } from '@angular/forms';
import { FeaturemodelService } from 'src/app/core/service/featuremodel.service';

import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { FeaturebomService } from 'src/app/core/service/featurebom.service';
import { DialogService } from 'src/app/core/service/dialog.service';

@Component({
  selector: 'app-feature-model-add-edit',
  templateUrl: './feature-model-add-edit.component.html',
  styleUrls: ['./feature-model-add-edit.component.scss']
})
export class FeatureModelAddEditComponent implements OnInit {

  @ViewChild("inputBox", {static :true}) _el: ElementRef;
  @ViewChild("select",  {static :true}) _ele: ElementRef;

  public featureBom: any = [];
  //public featureModel:any ={};
  public featureModel: any = [];
  public form: FormGroup;

  public commonData = new CommonData();
  public view_route_link = '/feature/view';
  //constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor(private fms: FeaturemodelService,        
     private router: Router, 
     private ActivatedRouter: ActivatedRoute,
     private commanService: CommonService, 
     private fbom: FeaturebomService, 
     private DialogService: DialogService) { }

  page_main_title = this.language.model_feature_master;
  section_title = "";
  companyName: string;
  username: string;
  lookupfor: string = '';
  serviceData: any;
  item: string = '';
  public codekey: string = "";
  public button = "save";
  public isDuplicateMode:boolean = false;
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = true;
  public isAssociatedBOMButtonVisible: boolean = true;
  public selectedFile: string = "";
  public model_name_label = this.language.Model_Name;
  public model_desc_label = this.language.Model_Desc;
  public model_code_label = this.language.model_code_label;
  public code_disabled = "false";
  public GetItemData: any = [];
  public showImageBlock: boolean = false;
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public selectedImage = "";
  public ModelImage: string = "";
  public isRefCodeDisabled = true;
  public isItemCodeDisabled = true;
  public isItemlookupDisabled = true;
  public isReflookupDisabled = true;
  public IsAccessoryVisible = true;
  public temp = new Date();
  public  yesterday = new Date();
  public minimum_date = new Date(this.yesterday.setDate(this.temp.getDate() - 1));
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  public isUsedAccesoriesDisabled = false;
  public header_image_data: any;
  public menu_auth_index = '201';
  public made_changes:boolean = false;

  canDeactivate() {
    if(this.made_changes == true){
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }

  ngOnInit() {

    // const element = document.getElementsByTagName('body')[0];
    // // element.className = '';
    // element.classList.add('sidebar-toggled');
    // document.getElementById("opti_sidebar").classList.add('toggled');
     
    this.commonData.checkSession();
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    var todaysDate = new Date();
    this.featureBom.Date = todaysDate;
    this.codekey = "";
    this.codekey = this.ActivatedRouter.snapshot.paramMap.get('id');
    this.showImageBlock = false;
    // check screen authorisation - start
    this.commanService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          let objcc = this;
          setTimeout(function () {
            objcc.commanService.show_notification(objcc.language.notAuthorisedScreen, 'error');           
            objcc.router.navigateByUrl('home');
          }, 200);
        }
      },
      error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      });
      // check screen authorisation - end

    if (this.codekey === "" || this.codekey === null) {
      this.button = "save";
      this.made_changes = true; 
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.section_title = this.language.add;
      this.featureBom.Accessory = 'N';
      this.featureBom.Status = "Active";
      this.code_disabled = "false";
      this.featureBom.type = "Feature";
      if (this.featureBom.type == "Feature") {
        this.model_code_label = this.language.model_FeatureCode;
        this.model_name_label = this.language.Model_FeatureName;
        this.model_desc_label = this.language.Model_FeatureDesc;
        this.isItemlookupDisabled = true;
        this.isReflookupDisabled = true;
        this.IsAccessoryVisible = false;
      } else {
        this.IsAccessoryVisible = true;
      }
      this._el.nativeElement.focus();
      this.showLoader = false;
    }
    else {
      this.button = "update";
      this.made_changes = false; 
      /* this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false; */
      /* this.isDeleteButtonVisible = true; */
      this.section_title = this.language.edit;
      /* this.code_disabled = "true"; */

      if(this.ActivatedRouter.snapshot.url[0].path == "edit") {
        this.code_disabled = "true";
        this.button = "update"
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDuplicateMode = false;
        this.isDeleteButtonVisible = true;
      } else if(this.ActivatedRouter.snapshot.url[2].path == "add"){
        this.code_disabled = "false";
        this.button = "save"
        this.isUpdateButtonVisible = false;
        this.isSaveButtonVisible = true;
        this.isDuplicateMode = true;
        this.isDeleteButtonVisible = false;
      } else {
        this.code_disabled= "true";
        this.button = "update"
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDuplicateMode = false;
        this.isDeleteButtonVisible = true;
      }


      this.fms.GetRecordById(this.companyName, this.codekey).subscribe(
        data => {

          if(data != undefined && data.length > 0){
            if (data[0].ErrorMsg == "7001") {
              this.made_changes = false;
                this.showLoader = false;
                this.commanService.RemoveLoggedInUser().subscribe();
                this.commanService.signOut(this.router, 'Sessionout');
                return;
            } 
        }

          console.log(data);
          this.featureBom.Code = data[0].OPTM_FEATURECODE
          this.featureBom.Name = data[0].OPTM_DISPLAYNAME
          this.featureBom.Desc = data[0].OPTM_FEATUREDESC
          this.featureBom.Date = data[0].OPTM_EFFECTIVEDATE
          this.featureBom.type = data[0].OPTM_TYPE
          this.featureBom.Status = data[0].OPTM_STATUS
          this.featureBom.ItemName = data[0].OPTM_MODELTEMPLATEITEM
          this.featureBom.Ref = data[0].OPTM_ITEMCODEGENREF
          this.featureBom.Accessory = data[0].OPTM_ACCESSORY

          if(this.isDuplicateMode){
            this.featureBom.Code = ""
          }

          if (data[0].isRefExists == "Ref_already_exist") {
            this.isUsedAccesoriesDisabled = true;
          }
          else {
            this.isUsedAccesoriesDisabled = false;
          }

          if (data[0].OPTM_PHOTO !== undefined && data[0].OPTM_PHOTO !== "" && data[0].OPTM_PHOTO !== 0) {
            this.featureBom.Image = data[0].OPTM_PHOTO
            this.ModelImage = this.commonData.get_current_url() + data[0].OPTM_PHOTO
            this.showImageBlock = true;

          }

          this.featureBom.Image = data[0].OPTM_PHOTO
          if (this.featureBom.Image == "" || this.featureBom.Image == null || this.featureBom.Image == undefined) {
            this.showImageBlock = false;
          }
          console.log(data[0].OPTM_TYPE);
          if (data[0].OPTM_TYPE == "Feature") {
            this.model_code_label = this.language.model_FeatureCode;
            this.model_name_label = this.language.Model_FeatureName;
            this.model_desc_label = this.language.Model_FeatureDesc;
            this.isRefCodeDisabled = true;
            this.isItemCodeDisabled = true;
            this.isItemlookupDisabled = true;
            this.isReflookupDisabled = true;
            this.IsAccessoryVisible = false;
          } else {
            this.model_code_label = this.language.model_ModelCode;
            this.model_name_label = this.language.Model_ModelName;
            this.model_desc_label = this.language.Model_ModelDesc;
            this.isRefCodeDisabled = false;
            this.isItemCodeDisabled = false;
            this.isItemlookupDisabled = false;
            this.isReflookupDisabled = false;
            this.IsAccessoryVisible = true;
          }
          this.showLoader = false;
        },
        error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commanService.isUnauthorized();
          }
          return;
        })
    }
  }

  ngAfterViewInit() {

    if (this.codekey === "" || this.codekey === null) {
      this._el.nativeElement.focus();
    }
    else {
      this._ele.nativeElement.focus();
    }
  }

  validate_special_char(code){
    if(code !== "" && this.commonData.excludeSpecialCharRegex.test(code) === true) {
      this.made_changes = true;
      this.featureBom.Code = "";     
      this.commanService.show_notification(this.language.ValidString, 'error');
    }
  }

  onTypeLookupChange() {
    this.made_changes = true;
    if (this.featureBom.type == "Feature") {
      this.model_code_label = this.language.model_FeatureCode;
      this.model_name_label = this.language.Model_FeatureName;
      this.model_desc_label = this.language.Model_FeatureDesc;
      this.isRefCodeDisabled = true;
      this.isItemCodeDisabled = true;
      this.isItemlookupDisabled = true;
      this.isReflookupDisabled = true;
      this.IsAccessoryVisible = false;
    } else {
      this.model_code_label = this.language.model_ModelCode;
      this.model_name_label = this.language.Model_ModelName;
      this.model_desc_label = this.language.Model_ModelDesc;
      this.isRefCodeDisabled = false;
      this.isItemCodeDisabled = false;
      this.isItemlookupDisabled = false;
      this.isReflookupDisabled = false;
      this.IsAccessoryVisible = true;
    }

  }
  onSaveClick() {
    this.showLookupLoader = true;
    this.featureModel = [];
    var validateStatus = this.Validation();
    var EffectiveDate:any = ""
    if(this.isDuplicateMode) {
      EffectiveDate = new Date(this.featureBom.Date);
    } else {
      EffectiveDate = this.featureBom.Date;
    }
    if (validateStatus == true) {
      this.featureModel.push({
        CompanyDBId: this.companyName,
        FeatureCode: this.featureBom.Code,
        DisplayName: this.featureBom.Name,
        FeatureDesc: this.featureBom.Desc,
        EffectiveDate: (EffectiveDate).getFullYear() + '/' + ((EffectiveDate).getMonth() + 1) + '/' + (EffectiveDate).getDate(),
        Type: this.featureBom.type,
        FeatureStatus: this.featureBom.Status,
        ModelTemplateItem: this.featureBom.ItemName,
        ItemCodeGenerationRef: this.featureBom.Ref,
        PicturePath: this.featureBom.Image,
        CreatedUser: this.username,
        Accessory: this.featureBom.Accessory
      })

      this.fms.saveData(this.featureModel).subscribe(
        data => {
          this.showLookupLoader = false;
          if (data == "7001") {
            this.made_changes = false;
            this.commanService.RemoveLoggedInUser().subscribe();
            this.commanService.signOut(this.router, 'Sessionout');
            return;
          }

          if (data == "True") {
            this.made_changes = false; 
            this.commanService.show_notification(this.language.DataSaved, 'success');          
            this.router.navigateByUrl(this.view_route_link);
            return;
          }
          else if (data == "Record Already Exist") {
            this.commanService.show_notification(this.language.DuplicateCode, 'error');           
            return;
          }
          else {
            this.commanService.show_notification(this.language.DataNotSaved, 'error');       
            return;
          }
        },
        error => {
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commanService.isUnauthorized();
          }
          return;
        }
      )
     
    }
    else{
      this.showLookupLoader = false;
    }
  }

  onTemplateItemPress(status) {
    this.lookupfor = 'model_template';
    this.showLookupLoader = true;
    this.made_changes = true;
    this.getAllTemplateItems();

  }

  getAllTemplateItems() {
    this.fms.getTemplateItems(this.companyName).subscribe(
      data => {
        this.showLookupLoader = false;

        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
              this.showLoader = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.router, 'Sessionout');
              return;
          } 
      }
        this.serviceData = data;

      },
      error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      }
    )
  }

  uploadimagefile(files: any) {
    if (files.length === 0)
      return;
    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }
    this.made_changes = true; 
    this.fms.UploadFeature(formData).subscribe(data => {
      if (data !== undefined && data != "") {
        if (data.body === "False") {
          this.showImageBlock = false;
          this.commanService.show_notification(this.language.filecannotupload, 'error');           
        }
        else {

          if (data.body != "" && data.body != undefined) {

            this.featureBom.Image = data.body
            this.ModelImage = this.commonData.get_current_url() + data.body
            this.showImageBlock = true;
          }
        }
      }
    },
    error => {
      if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
        this.commanService.isUnauthorized();
      }
      return;
    })
  }

  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

  call_change_event(){
    this.made_changes = true;
  }

  onItemGenerationPress(status) {
    this.showLookupLoader = true;
    this.lookupfor = 'model_item_generation';
    this.made_changes = true;
    this.getAllItemGenerated();
  }
  getAllItemGenerated() {
     this.made_changes = true; 
    this.fms.getGeneratedItems(this.companyName).subscribe(
      data => {
        this.showLookupLoader = false;
        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.router, 'Sessionout');
              return;
          } 
      }
        this.serviceData = data;
      },
      error => {
        this.showLookupLoader = false;
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      }
    )
  }

  //validation of inputs
  Validation() {
    if (this.featureBom.Code == undefined || this.featureBom.Code == '') {
      this.commanService.show_notification(this.language.CodeBlank, 'error');
      this.showLookupLoader = false;
      return false;
    }
    if (this.featureBom.type == undefined || this.featureBom.type == '') {
      this.commanService.show_notification(this.language.TypeBlank, 'error');      
      this.showLookupLoader = false;
      return false;
    }
    if (this.featureBom.Name == undefined || this.featureBom.Name == '') {
      this.commanService.show_notification(this.language.ModelName, 'error');      
      this.showLookupLoader = false;
      return false;
    }
    if (this.featureBom.type == "Model") {
      if (this.featureBom.ItemName == undefined || this.featureBom.ItemName == '') {
        this.commanService.show_notification(this.language.ModelItem, 'error'); 
        
        this.showLookupLoader = false;
        return false;
      }
      if (this.featureBom.Ref == undefined || this.featureBom.Ref == '') {
        this.commanService.show_notification(this.language.ModeRef, 'error');      
        this.showLookupLoader = false;
        return false;
      }
    }
    return true;
  }
  onUpdateClick() {
    this.showLookupLoader = true;
    this.featureModel = [];
    var validateStatus = this.Validation();
    if (validateStatus == true) {
      this.featureModel.push({
        CompanyDBId: this.companyName,
        FeatureId: this.codekey,
        FeatureCode: this.featureBom.Code,
        DisplayName: this.featureBom.Name,
        FeatureDesc: this.featureBom.Desc,
        EffectiveDate: this.featureBom.Date,
        Type: this.featureBom.type,
        FeatureStatus: this.featureBom.Status,
        ModelTemplateItem: this.featureBom.ItemName,
        ItemCodeGenerationRef: this.featureBom.Ref,
        PicturePath: this.featureBom.Image,
        CreatedUser: this.username,
        Accessory: this.featureBom.Accessory
      })

      this.fms.updateData(this.featureModel).subscribe(
        data => {
          this.showLookupLoader = false;
          console.log(data);
          if (data == "7001") {
            this.made_changes = false;
            this.commanService.RemoveLoggedInUser().subscribe();
            this.commanService.signOut(this.router, 'Sessionout');
            return;
          }

          if (data == "True") {
            this.commanService.show_notification(this.language.DataUpdateSuccesfully, 'success');  
            this.router.navigateByUrl(this.view_route_link);
            return;
          }
          else if (data == "Record Already Exist") {
            this.commanService.show_notification(this.language.DuplicateCode, 'error'); 
            return;
          }
          else {
            this.commanService.show_notification(this.language.DataNotUpdate, 'error');            
            return;
          }
        },
        error => {
          this.showLookupLoader = false;
          if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
            this.commanService.isUnauthorized();
          }
          return;
        })
    }
    else{
      this.showLookupLoader = false;
    }
  }

  onDeleteClick() {
    //var result = confirm(this.language.DeleteConfimation);
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }


  //THis will get the BOMs associated to selected feature id
  onAssociatedBOMClick() {
    if (this.codekey != undefined) {
      this.showLookupLoader = true;
      this.fbom.ViewAssosciatedBOM(this.codekey).subscribe(
        data => {
          if (data != null && data != undefined) {
            if (data.length > 0) {
               if (data[0].ErrorMsg == "7001") {
                 this.made_changes = false;
                this.commanService.RemoveLoggedInUser().subscribe();
                this.commanService.signOut(this.router, 'Sessionout');
                this.showLookupLoader = false;
                return;
              }

              this.serviceData = data;
              this.lookupfor = 'associated_BOM';
              this.showLookupLoader = false;
            }
            else {
              this.commanService.show_notification(this.language.no_assocaited_bom_with_feature + " : " + this.featureBom.Code, 'error'); 
              this.showLookupLoader = false;
              return;
            }
          }
          else {
            this.commanService.show_notification(this.language.no_assocaited_bom_with_feature + " : " + this.featureBom.Code, 'error'); 
            this.showLookupLoader = false;
            return;
          }
        },
        error => {
          this.commanService.show_notification(this.language.server_error, 'error');         
          this.showLookupLoader = false;
          return;
        }
      )
    }
    else {
      this.commanService.show_notification(this.language.FeatureCodeBlank, 'error');     
      this.showLoader = false;
      return;
    }
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      this.delete_record();

    }
    this.show_dialog = false;
  }

  delete_record() {
    //Logic to delete the 
    // button click function in here
    this.GetItemData = []
    this.GetItemData.push({
      CompanyDBId: this.companyName,
      FEATUREID: this.codekey,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.fms.DeleteData(this.GetItemData).subscribe(
      data => {

        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.router, 'Sessionout');
              return;
          } 
      }

        if(data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists"){
          this.commanService.show_notification(this.language.Refrence + ' at: ' + data[0].FeatureCode, 'error');
          }
        else if(data[0].IsDeleted == "1"){
            this.commanService.show_notification(this.language.DataDeleteSuccesfully  + ' : ' + data[0].FeatureCode, 'error');
            this.made_changes = false;
            this.router.navigateByUrl(this.view_route_link);
        }
        else {
            this.commanService.show_notification(this.language.DataNotDelete + ' : ' + data[0].FeatureCode, 'error');
             }
        // if (data === "True") {
        //   this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
        //   this.router.navigateByUrl(this.view_route_link);
        //   return;
        // }
        // else if (data === "Exist") {
        //   this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
        //   return;
        // }
        // else {
        //   this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
        //   return;
        // }
      },
      error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      }
    )
  }

  getLookupValue($event) {
    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
        this.featureBom.ItemName = $event[0];
        this.featureBom.ItemCode = $event[1];
      }
      if (this.lookupfor == "model_item_generation") {
        this.featureBom.Ref = $event[0];
        //  this.featureBom.RefCode = $event[1];
      }
    }
  }
  onItemCodeChange() {
    this.made_changes =true;
    this.fms.onItemCodeChange(this.companyName, this.featureBom.ItemName).subscribe(
      data => {

        if(data != undefined && data.length > 0 ){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.router, 'Sessionout');
              return;
          } 
       }

        if (data === "False") {
          this.commanService.show_notification(this.language.invalid_itemcode, 'error');         
          this.featureBom.ItemName = "";
          return;
        }
      },
      error => {
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.commanService.isUnauthorized();
        }
        return;
      })

  }
  onRefCodeChange() {
    this.fms.onRefCodeChange(this.companyName, this.featureBom.Ref).subscribe(
      data => {
        console.log(data);

        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
            this.made_changes = false;
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.router, 'Sessionout');
              return;
          } 
       }

        if (data === "False") {
          this.commanService.show_notification(this.language.Model_RefValidate, 'error');          
          this.featureBom.Ref = "";
          return;
        }
      })
  }

}
