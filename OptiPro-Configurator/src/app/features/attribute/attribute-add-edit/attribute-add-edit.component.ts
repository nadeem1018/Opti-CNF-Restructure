import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from 'src/app/core/data/CommonData';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { DialogService } from 'src/app/core/service/dialog.service';
import { AttributeService } from 'src/app/core/service/attribute.service';

@Component({
  selector: 'app-attribute-add-edit',
  templateUrl: './attribute-add-edit.component.html',
  styleUrls: ['./attribute-add-edit.component.scss']
})
export class AttributeAddEditComponent implements OnInit {

  @ViewChild("Attributeinputbox", { static: true }) _el: ElementRef;
  @ViewChild("button", { static: true }) _ele: ElementRef;
  public commonData = new CommonData();
  public view_route_link = '/attribute/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modelbom_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public currentrowindex: number;
  public isExplodeButtonVisible: boolean = true;
  public isVerifyButtonVisible: boolean = true;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public isDisableAttributeCode: boolean = false;
  public showImageBlock: boolean = false;
  public showheaderImageBlock: boolean = false;
  public update_id: string = "";
  public attributeCode: string = "";
  public attributeName: string = "";
  public addAttributeList: any = [];
  public seq: string = "";


  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  ;
  // public mandatory_disabled: boolean = false;
  public menu_auth_index = '203';
  public defaultcheckbox: boolean = false;
  public is_default: boolean = false;
  public config_params: any;

  // modalRef: BsModalRef;

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: AttributeService, private CommonService: CommonService, private DialogService: DialogService) { }

  companyName: string;
  page_main_title = this.language.attribute_master
  public username: string = "";
  serviceData: any;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;




  canDeactivate() {
    if (CommonData.made_changes == true) {
      return this.DialogService.confirm('');
    } else {
      return true;
    }
  }


  ngOnInit() {
    // this.data1 = this.unflatten(this.data1);
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    const element = document.getElementsByTagName('body')[0];
    CommonData.made_changes = false;
    this.commonData.checkSession();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');

    if (this.image_data.length > 0) {
      this.showImageBlock = true;
    }


    // check screen authorisation - start
    this.CommonService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          setTimeout(() => {
            this.CommonService.show_notification(this.language.notAuthorisedScreen, 'error');
            this.route.navigateByUrl('home');
          }, 200);
        }
      },
      error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      });

    this.service.currentAttributeData.subscribe((data) => {
      console.log(data);
      if (data != undefined) {
        this.attributeCode = data.OPTM_ATTR_CODE;
        this.attributeName = data.OPTM_ATTR_NAME;
        this.seq = data.OPTM_SEQ;
      }
    });

    if (this.update_id === "" || this.update_id === null) {
      // CommonData.made_changes = true;
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this._el.nativeElement.focus();
      this.showLoader = false;
      this.attributeCode = '';
      this.attributeName = '';
      this.isDisableAttributeCode = false;
    }
    else {
      this.showLoader = false;
      CommonData.made_changes = false;
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;

      if (this.ActivatedRouter.snapshot.url[0].path == "edit") {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = true;
        this.isDisableAttributeCode = true;

      } else if (this.ActivatedRouter.snapshot.url[0].path == "add") {
        this.isUpdateButtonVisible = false;
        this.isSaveButtonVisible = true;
        this.isDeleteButtonVisible = false;

      } else {
        this.isUpdateButtonVisible = true;
        this.isSaveButtonVisible = false;
        this.isDeleteButtonVisible = false;

      }
      //  this.get_modelbom_details(this.update_id, false);
    }
  }

  get_modelbom_details(id, navigat_to_header) {
    this.showLoader = true;

    // this.service.GetDataByModelId(id).subscribe(
    //   data => {
    //     if(data != undefined && data.LICDATA != undefined){
    //       if (data.LICDATA[0].ErrorMsg == "7001") {
    //         CommonData.made_changes = false;
    //         this.CommonService.RemoveLoggedInUser().subscribe();
    //         this.CommonService.signOut(this.route, 'Sessionout');
    //         return;
    //       } 
    //     }
    //     if (data.ModelHeader.length > 0) {
    //       this.modelbom_data.modal_id = data.ModelDetail[0].OPTM_MODELID
    //       this.modelbom_data.modal_code = data.ModelHeader[0].OPTM_FEATURECODE
    //       this.modelbom_data.feature_name = data.ModelHeader[0].OPTM_DISPLAYNAME;
    //       this.modelbom_data.feature_desc = data.ModelHeader[0].OPTM_FEATUREDESC;
    //       this.modelbom_data.image_path = data.ModelHeader[0].OPTM_PHOTO;
    //       this.modelbom_data.is_ready_to_use = data.ModelHeader[0].OPTM_READYTOUSE
    //     }

    //     //this.onExplodeClick('auto');

    //     },error => {
    //       this.showLoader = false;
    //       if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
    //         this.CommonService.isUnauthorized();
    //       }
    //       return;
    //     }
    //     )
  };

  ngAfterViewInit() {
    if (this.update_id === "" || this.update_id === null) {
      this._el.nativeElement.focus();
    }
    else {
      //this._ele.nativeElement.focus();
    }
  }

  validate_special_char() {
    var Code = this.attributeCode;
    if (Code !== "" && this.commonData.excludeSpecialCharRegex.test(Code) === true) {
      CommonData.made_changes = true;
      this.attributeCode = "";
      this.CommonService.show_notification(this.language.ValidString, 'error');
    }
  }

  // function for not allowed Space 
  Validate_spaceNOAllow(value: any) {
    var regexp = /^\S*$/;
    if (regexp.test(value)) {
      return true;
    } else {
      return false;
    }
  }

  onSave() {
    var obj = this;

    if (this.attributeCode == "" || this.attributeCode == null) {

      this.CommonService.show_notification(this.language.attribute_code_blank, 'error');
      return false;
    }
    if (!this.Validate_spaceNOAllow(this.attributeCode)) {
      this.CommonService.show_notification(this.language.spaceAttributeCode, 'error');
      return false;
    }
    if (this.attributeName == "" || this.attributeName == null) {

      this.CommonService.show_notification(this.language.attribute_name_blank, 'error');
      return false;
    }
    this.showLookupLoader = true;
    this.addAttributeList = [];
    obj.save_data();

  }



  onDelete() {
    // var result = confirm(this.language.DeleteConfimation);
    this.dialog_params = [];
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }


  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      this.delete_row();
      this.show_dialog = false;
    }
    else {
      this.show_dialog = false;
    }
  }



  //delete values
  delete_row() {
    let GetItemData: any = []
    GetItemData.push({
      CompanyDBId: this.companyName,
      OPTM_SEQ: this.seq,
      OPTM_ATTR_CODE: this.attributeCode,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.service.DeleteData(GetItemData).subscribe(
      data => {

        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.route, 'Sessionout');
            return;
          }
        }


        if (data[0].IsDeleted == "0" && data[0].Message.includes("Reference Already Exist")) {
          this.CommonService.show_notification(data[0].Message, 'error');

          this.commonData.clearChildCheckbox();
        }
        else if (data[0].IsDeleted == "1") {
          this.CommonService.show_notification(this.language.DataDeleteSuccesfully, 'success');

          this.route.navigateByUrl('attribute/view');

          this.commonData.clearChildCheckbox();
        }
        else {
          this.CommonService.show_notification(this.language.DataNotDelete, 'error');
        }

        this.commonData.clearChildCheckbox();
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      });
  }




  save_data() {
    this.addAttributeList.push({
      OPTM_ATTR_CODE: this.attributeCode,
      OPTM_ATTR_NAME: this.attributeName
    });


    this.service.AddAttribute(this.addAttributeList).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          CommonData.made_changes = false;
          this.CommonService.RemoveLoggedInUser().subscribe();
          this.CommonService.signOut(this.route, 'Sessionout');
          return;
        }

        if (data == "True") {

          this.CommonService.show_notification(this.language.DataSaved, 'success');
          this.route.navigateByUrl('attribute/view');
          return;
        }
        else if (data == "Record Already Exist") {

          this.CommonService.show_notification(this.language.DuplicateCode, 'error');
          return;
        }
        else {

          this.CommonService.show_notification(this.language.DataNotSaved, 'error');
          return;
        }
      }, error => {
        this.showLookupLoader = false
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })

  }


  onUpdate() {

    if (this.attributeName == "" || this.attributeName == null) {
      this.CommonService.show_notification(this.language.attribute_name_blank, 'error');
      return false;
    }
    this.addAttributeList.push({
      OPTM_ATTR_CODE: this.attributeCode,
      OPTM_ATTR_NAME: this.attributeName,
      OPTM_SEQ: this.seq
    });


    this.service.UpdateAttribute(this.addAttributeList).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          CommonData.made_changes = false;
          this.CommonService.RemoveLoggedInUser().subscribe();
          this.CommonService.signOut(this.route, 'Sessionout');
          return;
        }

        if (data == "True") {

          this.CommonService.show_notification(this.language.DataSaved, 'success');
          this.route.navigateByUrl('attribute/view');
          return;
        }
        else if (data == "AlreadyExist") {

          this.CommonService.show_notification(this.language.DuplicateCode, 'error');
          return;
        }
        else {

          this.CommonService.show_notification(this.language.DataNotSaved, 'error');
          return;
        }
      }, error => {
        this.showLookupLoader = false
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })

  }

}
