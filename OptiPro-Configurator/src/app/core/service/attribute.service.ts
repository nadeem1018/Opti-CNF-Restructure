import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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

  // set menu data global
  public attributeData = new BehaviorSubject<any>([]);
  currentAttributeData = this.attributeData.asObservable();

  public setAttributeData(attributeItem){
    this.attributeData.next(attributeItem);
  }


  getAttributeList(): Observable<any> {
    console.log(' in  service');

    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
    UsernameForLic: sessionStorage.getItem("loggedInUser")}]) }
    return this.httpclient.post(this.config_params.service_url + "/Attribute/GetAttributeList", jObject, this.common_params.httpOptions);
  }
   AddAttribute(SaveData): Observable<any>{
    SaveData[0]['GUID'] = sessionStorage.getItem("GUID");
    SaveData[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
    SaveData[0]['CompanyDBID'] = sessionStorage.selectedComp;
    let jObject: any = { Attribute: JSON.stringify({AddAttribute: SaveData})};
   // let jObject = {Attribute: JSON.stringify({ CompanyDBID: sessionStorage.selectedComp, GUID: sessionStorage.getItem("GUID"),
  //  UsernameForLic: sessionStorage.getItem("loggedInUser"), AttributeCode: attributeCode, AttributeName: attributeName  }) }
     return this.httpclient.post(this.config_params.service_url + "/Attribute/AddAttribute", jObject, this.common_params.httpOptions);
  }

  GetAttributeList (search:string,PageNumber:any,record_per_page:any): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    this.logged_in_company = sessionStorage.selectedComp;
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page,
      GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Attribute/GetAttributeList", jObject, this.common_params.httpOptions);
  }
  

}
