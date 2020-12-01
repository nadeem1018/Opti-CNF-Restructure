import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from '../data/CommonData';
@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  getAttributeList(): Observable<any> {
    console.log(' in  service');

    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Attribute/GetAttributeList", jObject, this.common_params.httpOptions);
  }
   AddAttribute(attributeCode, attributeName): Observable<any>{
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser"), AttributeCode: attributeCode, AttributeName: attributeName  }]) }
     return this.httpclient.post(this.config_params.service_url + "/Attribute/AddAttribute", jObject, this.common_params.httpOptions);
  }


  

}
