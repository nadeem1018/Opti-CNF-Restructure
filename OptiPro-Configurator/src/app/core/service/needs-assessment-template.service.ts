import { Injectable } from '@angular/core';
import { CommonData } from '../data/CommonData';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NeedsAssessmentTemplateService {

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

    GetNeedsAssessmentList(): Observable<any> {
      //JSON Obeject Prepared to be send as a param to API
      this.logged_in_company = sessionStorage.selectedComp;
      let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
      //Return the response form the API  
      return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentTemplate/GetNeedsAssessmentList", jObject, this.common_params.httpOptions);
	  }
	  
	  AddUpdateNeedAssessmentTemplateData(final_dataset_to_save): Observable<any> {
		let cache_control = this.common_params.random_string(40);
		final_dataset_to_save.OPCONFIG_NEEDSASSESSMENT_TEMPLATE[0]['GUID'] = sessionStorage.getItem("GUID");
		final_dataset_to_save.OPCONFIG_NEEDSASSESSMENT_TEMPLATE[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
		final_dataset_to_save.OPCONFIG_NEEDSASSESSMENT_TEMPLATE[0]['CompanyDBID'] = sessionStorage.selectedComp;      
		var jObject = { GetData: JSON.stringify(final_dataset_to_save) };
	   
		//Return the response form the API  
		return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentTemplate/AddUpdateNeedsAssessmentTemplate?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
	  }
	  CheckValidAssessmentIDForNeedsAssessmentTemplate(id): Observable<any> {
		//JSON Obeject Prepared to be send as a param to API
		this.logged_in_company = sessionStorage.selectedComp;
		let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,OPTM_ASSESSMENTID: id,
		  GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")}]) };
		//Return the response form the API  
		return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentTemplate/CheckValidAssessmentIDForNeedsAssessmentTemplate", jObject, this.common_params.httpOptions);
		}
	  
  }
