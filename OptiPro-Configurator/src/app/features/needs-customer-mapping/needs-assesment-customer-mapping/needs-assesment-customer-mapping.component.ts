import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { ConfigureNeedAssesmentService } from 'src/app/core/service/configureneedAssesment.service';

@Component({
  selector: 'app-needs-assesment-customer-mapping',
  templateUrl: './needs-assesment-customer-mapping.component.html',
  styleUrls: ['./needs-assesment-customer-mapping.component.scss']
})
export class NeedsAssesmentCustomerMappingComponent implements OnInit {

  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/home';
  public lookupfor: string = '';
  public selectedImage = "";
  public showLookupLoader = false;
  public serviceData = [];
  public currentrowIndex = 0;
  public need_customer_table = [{ customer_name: "sanyam", template_ID: "T1", rowindex: 0 }, { customer_name: "sam", template_ID: "T2", rowindex: 1 }, { customer_name: "san", template_ID: "T3", rowindex: 2 }];

  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: ConfigureNeedAssesmentService) { }

  ngOnInit() {
  }

  getListDefaultNeedAssementTemplate(rowindex: any) {
    this.currentrowIndex = rowindex;
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

  // function for customer number change 

  on_customerName_change(customerName: any, rowNumber: any) {
    this.currentrowIndex = rowNumber;
    for (let i = 0; i < this.need_customer_table.length; i++) {
      if (i == this.currentrowIndex) {
        this.need_customer_table[i].customer_name = customerName;
      }
    }
  }

  // function for geeting default template output from look up component
  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    CommonData.made_changes = true;
    this.need_customer_table[this.currentrowIndex].template_ID = $event[0];
  }


  // function for check proper Default template 

  onCheckDefaultTemplate(TemplateID, rowIndex) {
    CommonData.made_changes = true;
    this.service.onDefaultTemplateCheck(TemplateID).subscribe(
      data => {
        if (data === "False") {

          this.CommonService.show_notification(this.language.InvalidDefaultTemplate, 'error');
          this.need_customer_table[rowIndex].template_ID = "";
          return;
        }
        else {
          this.need_customer_table[rowIndex].template_ID = TemplateID;
          return;
        }
      }, error => {
        if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
          this.CommonService.isUnauthorized();
        }
        return;
      })
  }

  // function for Update data 

  onSaveClick() {
    console.log(this.need_customer_table);
    this.showLookupLoader = true;
    this.service.SaveConfigurationNeedAssesment(this.need_customer_table).subscribe(data => {
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

}
