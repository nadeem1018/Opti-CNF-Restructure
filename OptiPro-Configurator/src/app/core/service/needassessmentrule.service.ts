import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CommonData } from '../data/CommonData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NeedassessmentruleService {

  config_params: any;
	common_params = new CommonData();
	logged_in_company = sessionStorage.selectedComp;
	public current_date = new Date();
	public formatted_date;
	constructor(private httpclient: HttpClient) {
		this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
		this.formatted_date = (this.current_date.getFullYear()) + '/' + (this.current_date.getMonth() + 1) + '/' + this.current_date.getDate();
	}

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'multipart/form-data',
			'Accept': 'application/json'
		})
    }

    getAllViewDataForModelBom(search:string,PageNumber:any,record_per_page:any): Observable<any> {

      //JSON Obeject Prepared to be send as a param to API
      this.logged_in_company = sessionStorage.selectedComp;
      let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser") }]) };
      //Return the response form the API  
      return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentRule/GetModelForNeedsAssessmentRule", jObject, this.common_params.httpOptions);
    }

    SaveData(Data): Observable<any> {
      Data["OPCONFIG_NS_RWB_HEADER"][0]['GUID'] = sessionStorage.getItem("GUID");
      Data["OPCONFIG_NS_RWB_HEADER"][0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
      //JSON Obeject Prepared to be send as a param to API
      let jObject: any = { AddRule: JSON.stringify(Data) };
      //Return the response form the API  
      return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentRule/AddUpdateDataForNeedsAssessmentRule ", jObject, this.common_params.httpOptions);
    }
}
