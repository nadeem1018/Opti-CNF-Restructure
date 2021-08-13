import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
// import { CommonData } from "src/app/models/CommonData";
import { CommonData } from "../data/CommonData";

@Injectable({
  providedIn: 'root'
})

export class OutputService {

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

  GetModelList(UserDetail, needassessmentheader, needassessmentoption): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    let jObject = { GetModel: JSON.stringify({ USERDETAIL: UserDetail, NEEDSASSESSMENTHEADER: needassessmentheader, NEEDSASSESSMENT_OPTIONS: needassessmentoption }) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetModelForConfigureWizard?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetAttributeResult(FeatureBOMDetailAttributeData, ModelBOMDetailAttributeData): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
    let jObject: any = { GetModelFeatureBOMAttribute: JSON.stringify({ FeatureBOMDetailAttribute: FeatureBOMDetailAttributeData, ModelBOMDetailAttribute: ModelBOMDetailAttributeData }) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAttributeResult?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getFeatureList(modelid): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    let jObject = {
      GetFeature: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelId: modelid,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureForConfigureWizard?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_id, modelid): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    let jObject = { GetFeature: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, FeatureId: feature_id, ModelId: modelid }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureListForSelectedFeatureForConfigureWizard?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetAccessory(): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    let jObject = { GetData: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAccessorry?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetItemDataForSelectedAccessorry(feature_id, modelid): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    let jObject = { GetData: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, FeatureId: feature_id, ModelId: modelid }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetItemDataForSelectedAccessorry?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getCustomerLookupData(CompanyDBID: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: CompanyDBID,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerList?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetDataForModelBomOutput(modelID, modalDesc): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelID: modelID, ModelDisplayName: modalDesc }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataForModelBomOutput?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  // GetDataByModelIDForFirstLevel(modelID, modalDesc): Observable<any> {
  //  let cache_control = this.common_params.random_string(40);
  //   //JSON Obeject Prepared to be send as a param to API
  //   let jObject = { GetData: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelID: modelID, ModelDisplayName: modalDesc }]) }
  //   //Return the response form the API  
  //   return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataByModelIDForFirstLevel?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  // }
  GetDataByModelIDForFirstLevel(AllDataForModelBomOutput): Observable<any> {
    let cache_control = this.common_params.random_string(40);


    AllDataForModelBomOutput["modelinputdatalookup"][0]['GUID'] = sessionStorage.getItem("GUID");
    AllDataForModelBomOutput["modelinputdatalookup"][0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify(AllDataForModelBomOutput) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataByModelIDForFirstLevel?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetDataForSelectedFeatureModelItem(data): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify(data) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataForSelectedFeatureModelItem?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  fillShipAddress(ShipData): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
    let jObject: any = { AddressDetail: JSON.stringify(ShipData) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerShipAddress?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  fillBillAddress(Billdata): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    //let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,BillTo:BillTo }]) };Billdata
    let jObject: any = { AddressDetail: JSON.stringify(Billdata) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerBillAddress?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  fillAllOwners(CompanyDBID: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { OwnerList: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: CompanyDBID }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAllOwners?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  validateInputCustomer(CompanyDBID: string, Customer: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: CompanyDBID, Customer: Customer,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/ValidateCustomer?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetCustomername(CompanyDBID: string, Customer: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: CompanyDBID, Customer: Customer,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerName?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  AddUpdateCustomerData(final_dataset_to_save): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    var jObject = { GetData: JSON.stringify(final_dataset_to_save) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/AddUpdateCustomerData?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }
  GetDataByModelId(id): Observable<any> {
    let cache_control = this.common_params.random_string(40);

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelId: id }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataByModelID?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getFinalBOMStatus(ilogID): Observable<any> {
    let cache_control = this.common_params.random_string(40);

    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      GetData: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, LogID: ilogID,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFinalStatus?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getConfigurationList(OperationType): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, OperationType: OperationType,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetLookupData?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetAllOutputData(OperationType, LogID, Description): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, OperationType: OperationType, LogID: LogID, Description: Description,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAllOutputData?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }
  onModelIdChange(code): Observable<any> {
    let cache_control = this.common_params.random_string(40);

    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      ModelList: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelCode: code,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidModelEntered?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetModelIdbyModelCode(modelcode): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { Customer: JSON.stringify([{ currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, ModelCode: modelcode }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetModelIdByModelCode?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }
  GetSavedDataMultiModel(modelcode): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    var jObject = { GetData: JSON.stringify(modelcode) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetSavedDataMultiModel?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }


  //This method will bring all data for customer
  getCustomerAllInfo(CompanyDBID: string, Customer: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        CompanyDBID: CompanyDBID, Customer: Customer,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerAllInfo?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getPrintOnReportStatus(item_list_data): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API

    let jObject = { GetData: JSON.stringify(item_list_data) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetReportData?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  CalculateAttributesonWizard(SelectedModelFeatureData, SelectedItemsData, SelectedFeatureAttributesData, SelectedModelAttributesData): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    SelectedModelFeatureData[0]['CompanyDBID'] = sessionStorage.selectedComp;
    //JSON Obeject Prepared to be send as a param to API
    // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
    let jObject: any = { GetData: JSON.stringify({ SelectedModelFeature: SelectedModelFeatureData, SelectedItems: SelectedItemsData, SelectedFeatureAttributes: SelectedFeatureAttributesData, SelectedModelAttributes: SelectedModelAttributesData }) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/CalculateAttributesonWizard?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetNeedsAssessmentOptionByCustomerId(Customer: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      GetData: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, CustID: Customer,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetNeedsAssessmentOptionByCustomerId?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  GetAllModelByAssessmentIDOptionID(Customer: string): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      GetData: JSON.stringify([{
        currentDate: this.formatted_date, CompanyDBID: sessionStorage.selectedComp, CustID: Customer,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAllModelByAssessmentIDOptionID?cache_control=" + cache_control, jObject, this.common_params.httpOptions);
  }

  getDelarCustomerData(): Observable<any> {
    let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        OPTM_DEALERCODE: sessionStorage.getItem("loggedInUser"), CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerDataByDealerCode", jObject, this.common_params.httpOptions);
  }

  getCustomerLookUpData(code: any): Observable<any> {
    // let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_DEALERCODE: code
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDealerCustomerList", jObject, this.common_params.httpOptions);
  }

  SaveDelarDetails(SaveData): Observable<any> {
    SaveData.OPCONFIG_DEALER_CUSTOMER[0]['GUID'] = sessionStorage.getItem("GUID");
    SaveData.OPCONFIG_DEALER_CUSTOMER[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
    SaveData.OPCONFIG_DEALER_CUSTOMER[0]['CompanyDBID'] = sessionStorage.selectedComp;
    let jObject: any = { Customer: JSON.stringify(SaveData) };
    return this.httpclient.post(this.config_params.service_url + "/Wizard/AddUpdateDealerCustomer", jObject, this.common_params.httpOptions);
  }


  getDealerDetails(dealarCode): Observable<any> {
    // let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_CUSTOMERCODE: dealarCode
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDealerCustomerView", jObject, this.common_params.httpOptions);
  }


  getCustomerAddressDetails(CustomerCode): Observable<any> {
    // let cache_control = this.common_params.random_string(40);
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      Customer: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_CUSTOMERCODE: CustomerCode
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDealerCustomerView", jObject, this.common_params.httpOptions);
  }

  SaveCustomerAddressDetails(SaveData): Observable<any> {
    SaveData.OPCONFIG_OUTPUT_DEALER_CUST_ADD[0]['GUID'] = sessionStorage.getItem("GUID");
    SaveData.OPCONFIG_OUTPUT_DEALER_CUST_ADD[0]['UsernameForLic'] = sessionStorage.getItem("loggedInUser");
    SaveData.OPCONFIG_OUTPUT_DEALER_CUST_ADD[0]['CompanyDBID'] = sessionStorage.selectedComp;
    SaveData.OPCONFIG_OUTPUT_DEALER_CUST_ADD[0]['OPTM_DEALERCODE'] = sessionStorage.getItem("loggedInUser");
    let jObject: any = { GetData: JSON.stringify(SaveData) };
    return this.httpclient.post(this.config_params.service_url + "/Wizard/AddUpdateCustomerData", jObject, this.common_params.httpOptions);
  }

  getItemDetails(): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetItemListData", jObject, this.common_params.httpOptions);
  }

  ValidItemCode(itemCode: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        ItemKey: itemCode
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/ValidateItemListData", jObject, this.common_params.httpOptions);
  }

  GetNeedsAssessmentSavedData(logID: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_LOGID: logID
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetSavedNeedsAssessmentData", jObject, this.common_params.httpOptions);
  }

  GetSavedAttributeData(logID: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_LOGID: logID
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetSavedAttributeData", jObject, this.common_params.httpOptions);
  }

  GetSavedDealerCustAddData(logID: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_LOGID: logID
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetSavedDealerCustAddData", jObject, this.common_params.httpOptions);
  }

  GetDealerMappingBycust(CustCode: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_CUSTCODE: CustCode
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDealerCustomerMappingByCustCode", jObject, this.common_params.httpOptions);
  }

  GetDataForAccesoriesAttribute(id: any, lineNo: any): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),
        OPTM_FEATUREID: id,
        OPTM_FEATUREDROWID: lineNo,

      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetSelectedAccesoryAttributes", jObject, this.common_params.httpOptions);
  }

  getCustomCWFeatureList(): Observable<any> {
    let jObject = {
      GetData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        ModelID: 785, ModelDisplayName: "STW100-01",
        GUID: sessionStorage.getItem("GUID"), UsernameForLic: sessionStorage.getItem("loggedInUser"),


      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataForCreatingOrderForLALIGHT", jObject, this.common_params.httpOptions);
  }

  AddUpdateCustomCw(model): Observable<any> {
   
    let jObject = {
      GetData: JSON.stringify(model)
    }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/CreateOrders", jObject, this.common_params.httpOptions);
  }



}
