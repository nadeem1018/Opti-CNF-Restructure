import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from '../data/CommonData';

@Injectable({
    providedIn: 'root'
})
export class DelarCustomerMappingService {
    config_params: any;
    common_params = new CommonData();
    logged_in_company = sessionStorage.selectedComp;

    constructor(private httpclient: HttpClient) {
        this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    }

    getDelarList(): Observable<any> {
        console.log(' in  service');

        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: this.logged_in_company, GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/DealerCustomerMapping/GetDataForDealerCustomerMapping ", jObject, this.common_params.httpOptions);
    }

    getCustomerList(): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/DealerCustomerMapping/GetCustomerList", jObject, this.common_params.httpOptions);
    }

    getModelList(data: any): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
                OPTM_DEALERCODE : data
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/DealerCustomerMapping/GetModelList", jObject, this.common_params.httpOptions);
    }

    getPriceList(): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/DealerCustomerMapping/GetPriceList", jObject, this.common_params.httpOptions);
    }

    SaveDelarDetailsList(SaveData): Observable<any> {
     //   let cache_control = this.common_params.random_string(40);
        SaveData['GUID'] = sessionStorage.getItem("GUID");
        SaveData['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
        SaveData['CompanyDBID'] = sessionStorage.selectedComp; 

        let jObject: any = { GetData: JSON.stringify(SaveData) };
        return this.httpclient.post(this.config_params.service_url + "/DealerCustomerMapping/AddUpdateDealerCustomerMapping", jObject, this.common_params.httpOptions);
    }

    onDefaultTemplateCheck(TemplateID): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"), OPTM_DEFAULT_TEMPLATE: TemplateID
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentConfiguration/CheckValidTemplateForNeedsAssessmentConfiguration", jObject, this.common_params.httpOptions);
    }




}
