import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/service/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { DialogService } from 'src/app/core/service/dialog.service';
import { ConfigureNeedAssesmentService } from 'src/app/core/service/configureneedAssesment.service';

@Component({
  selector: 'app-configuration-need-assesment',
  templateUrl: './configuration-need-assesment.component.html',
  styleUrls: ['./configuration-need-assesment.component.scss']
})
export class ConfigurationNeedAssesmentComponent implements OnInit {

  // Variables define for input parameters
  public showLookupLoader: any = false;
  pageTitle: any = "Configuration Need's Assesment";
  public applyNeedAssesment: any = false;
  // public showLoader: boolean = true;
  public customerWiseAssesment: any = false;
  public defaultAssesmentTemplate: any = "";
  public selectedImage = "";
  public OPTM_DEFAULT_TEMPLATE = "";
  public OPTM_ID = "1";
  public needAssementConfigureModel = [];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public lookupfor: string = "configure_need_assesment";
  public serviceData: any;
  public commonData = new CommonData();

  constructor(private httpclient: HttpClient, private router: Router, private CommonService: CommonService, private DialogService: DialogService, private service: ConfigureNeedAssesmentService) { }

  ngOnInit() {

    // this.getNeedAssesmentConfigurationDetails();
  }

  // function for get Need Assestment Configuration details 
  getNeedAssesmentConfigurationDetails() {

    CommonData.made_changes = true;

    this.service.getNeedAssementConfigureDetails().subscribe(data => {
      if (data != undefined && data.length > 0) {
        if (data[0].ErrorMsg == "7001") {
          CommonData.made_changes = false;
          // this.showLoader = false;
          this.CommonService.RemoveLoggedInUser().subscribe();
          this.CommonService.signOut(this.router, 'Sessionout');
          return;
        }
      }
      else {
        //   this.showLoader = false;
        return;
      }
      if (data.length > 0) {

        this.applyNeedAssesment = data[0].OPTM_ISAPPLICABLE == "Y" ? "true" : "false";
        this.customerWiseAssesment = data[0].OPTM_ISAPPLICABLE_CUST == "Y" ? "true" : "false";
      }
    })
  }

  // function for getting list of default templates .


  getListDefaultNeedAssementTemplate() {

    this.showLookupLoader = true;
    CommonData.made_changes = true;
    console.log('configure_need_assesment');
    this.serviceData = []
    this.lookupfor = 'configure_need_assesment';
    this.service.getNeedAssesmentTemplateList().subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
          console.log(this.serviceData);
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
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

  // function for saving Configuration Need's Assesment
  onSaveClick() {
    if (this.OPTM_DEFAULT_TEMPLATE == "") {
      this.CommonService.show_notification(this.language.noSelectDefaultTemplate, 'error');
      return;
    }
    this.needAssementConfigureModel = [];
    let OPTM_ISAPPLICABLE = this.applyNeedAssesment == true ? "Y" : "N";
    let OPTM_ISAPPLICABLE_CUST = this.customerWiseAssesment == true ? "Y" : "N";
    this.needAssementConfigureModel.push({
      OPTM_ID: this.OPTM_ID,
      OPTM_ISAPPLICABLE: OPTM_ISAPPLICABLE,
      OPTM_ISAPPLICABLE_CUST: OPTM_ISAPPLICABLE_CUST,
      OPTM_DEFAULT_TEMPLATE: this.OPTM_DEFAULT_TEMPLATE
    });
    this.showLookupLoader = true;
    this.service.SaveConfigurationNeedAssesment(this.needAssementConfigureModel).subscribe(data => {
      this.showLookupLoader = false;
      if (data == "7001") {
        CommonData.made_changes = false
        this.CommonService.RemoveLoggedInUser().subscribe();
        this.CommonService.signOut(this.router, 'Sessionout');
        return;
      }

      if (data === "True") {
        CommonData.made_changes = false
        this.CommonService.show_notification(this.language.DataSaved, 'success');
        return;
      }
      else {
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


  // function for geeting default template output from look up component
  getLookupValue($event) {
    CommonData.made_changes = true;
    this.OPTM_DEFAULT_TEMPLATE = $event[0];
    this.defaultAssesmentTemplate = $event[1];

  }

  // function for Navigate URL 
  navigateURL() {
    this.router.navigateByUrl('/need-assessment-template');
  }

  // function for on cancel click

  onCancel() {
    this.router.navigateByUrl('/home');
  }

}
