import { Injectable } from '@angular/core';
import { CommonData } from '../data/CommonData';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NeedassessmentService {

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

    AddUpdateNeedAssessmentData(final_dataset_to_save): Observable<any> {
      let cache_control = this.common_params.random_string(40);
      var jObject = { GetData: JSON.stringify(final_dataset_to_save) };
  
      //Return the response form the API  
      return this.httpclient.post(this.config_params.service_url + "/NeedsAssessment/AddUpdateNeedsAssessment?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
    }
}
