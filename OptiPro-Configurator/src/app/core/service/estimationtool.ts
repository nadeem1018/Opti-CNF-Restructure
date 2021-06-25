import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from '../data/CommonData';

@Injectable({
    providedIn: 'root'
})
export class EstimatetoolService {
    config_params: any;
    common_params = new CommonData();
    logged_in_company = sessionStorage.selectedComp;

    constructor(private httpclient: HttpClient) {
        this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    }

    getNeedAssesmentTemplateList(): Observable<any> {
        console.log(' in  service');

        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: this.logged_in_company, GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
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

        let jObject: any = { GetData: JSON.stringify({ needAssisment: SaveData }) };
        return this.httpclient.post(this.config_params.service_url + "/NeedsAssessmentConfiguration/AddUpdateNeedsAssessmentConfiguration", jObject, this.common_params.httpOptions);
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

    SaveMaterial(OPCONFIG_MATERIALHEADER, OPCONFIG_MATERIAL, OPCONFIG_MATERIALDETAILS,OPCONFIG_MATERIAL_SUMMARY): Observable<any> {

        //JSON Obeject Prepared to be send as a param to API
        // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
        let jObject: any = { GetData: JSON.stringify({ OPCONFIG_MATERIALHEADER: OPCONFIG_MATERIALHEADER, OPCONFIG_MATERIAL: OPCONFIG_MATERIAL, OPCONFIG_MATERIALDETAILS: OPCONFIG_MATERIALDETAILS,OPCONFIG_MATERIAL_SUMMARY:OPCONFIG_MATERIAL_SUMMARY }) };
        //Return the response form the API  
        return this.httpclient.post(this.config_params.service_url + "/Material/AddUpdateMaterial", jObject, this.common_params.httpOptions);
    }

    getMaterialDetails(Code): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"), OPTM_CODE: Code
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/Material/GetMaterialByCode", jObject, this.common_params.httpOptions);
    }

    getProductlDetails(): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/Material/GetAllMaterial", jObject, this.common_params.httpOptions);
    }

    getEstimateDetails(Code): Observable<any> {
        let jObject = {
            GetData: JSON.stringify([{
                CompanyDBID: sessionStorage.selectedComp,
                GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"), OPTM_CODE: Code
            }])
        }
        return this.httpclient.post(this.config_params.service_url + "/Estimate/GetEstimateMaterialByCode", jObject, this.common_params.httpOptions);
    }

    SaveEstimateMaster(OPCONFIG_EST_HEADER, OPCONFIG_EST_MATERIAL, OPCONFIG_EST_LABOR): Observable<any> {

        //JSON Obeject Prepared to be send as a param to API
        // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
        let jObject: any = { GetData: JSON.stringify({ OPCONFIG_EST_HEADER: OPCONFIG_EST_HEADER, OPCONFIG_EST_MATERIAL: OPCONFIG_EST_MATERIAL, OPCONFIG_EST_LABOR: OPCONFIG_EST_LABOR}) };
        //Return the response form the API  
        return this.httpclient.post(this.config_params.service_url + "/Estimate/AddEstimateData", jObject, this.common_params.httpOptions);
    }







}
