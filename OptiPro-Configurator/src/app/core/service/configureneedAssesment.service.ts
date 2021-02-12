import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from '../data/CommonData';

@Injectable({
    providedIn: 'root'
})
export class ConfigureNeedAssesmentService {
    config_params: any;
    common_params = new CommonData();
    logged_in_company = sessionStorage.selectedComp;

    constructor(private httpclient: HttpClient) {
        this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    }

    getNeedAssesmentTemplateList(): Observable<any> {
        console.log(' in  service');

        let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser") }]) }
        return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentConfiguration/GetNeedsAssessmentTemplateList", jObject, this.common_params.httpOptions);
    }

    getNeedAssementConfigureDetails(): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentConfiguration/GetNeedsAssessmentConfigurationData", jObject, this.common_params.httpOptions);
    }

    SaveConfigurationNeedAssesment(SaveData): Observable<any> {
        SaveData[0]['GUID'] = sessionStorage.getItem("GUID");
        SaveData[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
        SaveData[0]['CompanyDBID'] = sessionStorage.getItem("selectedComp");

        let jObject: any = {GetData : JSON.stringify(SaveData) };
        return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentConfiguration/AddUpdateNeedsAssessmentConfiguration", jObject, this.common_params.httpOptions);
    }




}
