import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { HttpClient } from '@angular/common/http';
import { CommonData } from 'src/app/core/data/CommonData';
import { EstimatetoolService } from 'src/app/core/service/estimationtool'

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

  public material_data = [];
  public sheet_summary = [];
  public material_Griddata = [];
  public index = 0;
  public SheetGridindex = 0;
  public programHrs = 0;
  public page_main_title = "Estimation - Working"
  public gridIndex = 0;
  public product_code = "";
  public serviceData = [];
  public lookupfor = "";
  public product_name = "";
  public showLookupLoader = false;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public fetchData: any = [];
  public SheetGridRow=[]; 

  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: EstimatetoolService) { }

  ngOnInit() {
    this.openGridTab('', 'Material');
  }

  addRow() {
    if (this.product_code == '' || this.product_code == undefined) {
      // show error to select product code first
      return;
    }
    let intVal: string = '0.00';
    this.material_data.push({
      'MaterialCode': '',
      'Thickness': intVal,
      'Material': "",
      'Type': "",
      'Description': "",
      'Length': intVal,
      'Width': intVal,
      'Area': intVal,
      'Perimeter': intVal,
      'Drop': intVal,
      'Total_Area': intVal,
      'Inner_Area': intVal,
      'Holes': intVal,
      'Hole_Size': intVal,
      'Circumference': intVal,
      'Slots': intVal,
      'Slots_Lg': intVal,
      'Slots_Width': intVal,
      'Circumference1': intVal,
      'Insets': intVal,
      'Qty': intVal,
      'rowIndex': this.index
    })
    this.index = this.index + 1;


  }

  UpdateSheetSummary(materialCode: string, thickness: number, material: string, type: string, totalArea: number, oldArea: number) {
    let intVal: string = '0.00';
    let recIndex = this.sheet_summary.findIndex(rec => rec.MaterialCode == materialCode);      

      if (recIndex == -1) {
        this.sheet_summary.push({
          'MaterialCode': materialCode,
          'Thickness': thickness.toFixed(2),
          'Material': material,
          'Type': type,
          'Total_Area': totalArea.toFixed(2),
          'Sheet_Width': intVal,
          'Sheet_Lg': intVal,
          'Sheet_Area': intVal,
          'Parts_Per_Sheet': intVal,
          'Sheets_Reqd': intVal,
          'rowIndex': this.SheetGridindex
        });
        this.SheetGridindex = this.SheetGridindex + 1;

      } else {
        let TotalArea: number = parseFloat(this.sheet_summary[recIndex].Total_Area) - oldArea + totalArea;
        if (TotalArea <= 0) {
          if ((oldArea > 0 || totalArea > 0) && parseFloat(this.sheet_summary[recIndex].Total_Area) > 0) {          
            this.sheet_summary.splice(recIndex, 1);
          }
        } else {
          this.sheet_summary[recIndex].Total_Area = TotalArea.toFixed(2);
          this.CalculateSheetsRequired(recIndex);
        }
      }
    
  }

  setEditData() {
    let materialData = this.fetchData.Material;
    let materialDetails = this.fetchData.MaterialDetails;
    let materialHeader = this.fetchData.MateriaHeader;
    this.product_name = materialHeader[0].OPTM_DESCRIPTION;
    this.product_code = materialHeader[0].OPTM_CODE;
    let SheetInfo = this.fetchData.sheet_summary;

    //Initialize Sheet Summary data table
    this.sheet_summary =[];
    this.material_data =[];
    this.material_Griddata =[];
    
    for (let i = 0; i < SheetInfo.length; i++) {
      this.sheet_summary.push({        
        'MaterialCode': SheetInfo[i].OPTM_MATERIALCODE,
        'Thickness': SheetInfo[i].OPTM_THICKNESS,
        'Material': SheetInfo[i].OPTM_MATERIAL,
        'Type': SheetInfo[i].OPTM_TYPE,
        'Total_Area': SheetInfo[i].OPTM_TOTAL_AREA,
        'Sheet_Width': SheetInfo[i].OPTM_SHEET_WIDTH,
        'Sheet_Lg': SheetInfo[i].OPTM_SHEET_LENGTH,
        'Sheet_Area': SheetInfo[i].OPTM_SHEET_AREA,
        'Parts_Per_Sheet': SheetInfo[i].OPTM_PARTSPER_SHEET,
        'Sheets_Reqd': SheetInfo[i].OPTM_SHEETREQ,
        'rowIndex': i
      })
      this.SheetGridindex = i + 1;
    }

    let intVal: string = '0.00';
    for (let i = 0; i < materialData.length; i++) {
      this.material_data.push({
        'Thickness': materialData[i].OPTM_THICKNESS,
        'MaterialCode': materialData[i].OPTM_MATERIALCODE,
        'Material': materialData[i].OPTM_MATERIAL,
        'Type': materialData[i].OPTM_TYPE,
        'Description': materialData[i].OPTM_DESCRIPTION,
        'Length': materialData[i].OPTM_LENGTH,
        'Width': materialData[i].OPTM_WIDTH,
        'Area': materialData[i].OPTM_AREA,
        'Perimeter': materialData[i].OPTM_PERIMETER,
        'Drop': materialData[i].OPTM_DROP,
        'Total_Area': materialData[i].OPTM_TOTALAREA,
        'Inner_Area': materialData[i].OPTM_INNERAREA,
        'Holes': materialData[i].OPTM_HOLES_QTY,
        'Hole_Size': materialData[i].OPTM_HOLESSIZE,
        'Circumference': materialData[i].OPTM_CIRCUMFERENCE,
        'Slots': materialData[i].OPTM_SLOTS_QTY,
        'Slots_Lg': materialData[i].OPTM_SLOT_LENGTH,
        'Slots_Width': materialData[i].OPTM_SLOT_WIDTH,
        'Circumference1': materialData[i].OPTM_SLOT_CIRCUMFERENCE,
        'Insets': materialData[i].OPTM_INSERT,
        'Sheet_Width': intVal,
        'Sheet_Lg': intVal,
        'Sheet_Area': intVal,
        'Parts_Per_Sheet': intVal,
        'Sheets_Reqd': intVal,
        'Qty': materialData[i].OPTM_QUANTITY,
        'rowIndex': i
      })
      this.index = i + 1;
    }

    for (let i = 0; i < materialDetails.length; i++) {
      this.material_Griddata.push({
        'Design_Total_Min': materialDetails[i].OPTM_DES_TOTALMINS,
        'Design_Total_hrs': materialDetails[i].OPTM_DES_TOTALHRS,
        'Program': materialDetails[i].OPTM_PROGRAM,
        'Deburr_Inches': materialDetails[i].OPTM_DEBURRINCHES,
        'Deburr_Total_Min': materialDetails[i].OPTM_DEBURR_TOTALMINS,
        'Deburr_Total_Hrs': materialDetails[i].OPTM_DEBURR_TOTALHRS,
        'Machine_Passes': materialDetails[i].OPTM_MACHINEPASSES,
        'Machine_Total_Min': materialDetails[i].OPTM_MACHINE_TOTALMINS,
        'Machine_Total_Hrs': materialDetails[i].OPTM_MACHINE_TOTALHRS,
        'Machine_SetUp_Time': materialDetails[i].OPTM_MACHINESETUPTIME,
        'Fit_Min_Parts': materialDetails[i].OPTM_FITMINS_PART,
        'Fit_Total_Min': materialDetails[i].OPTM_FIT_TOTALMINS,
        'Fit_Total_Hrs': materialDetails[i].OPTM_FIT_TOTALHRS,
        'Weld': materialDetails[i].OPTM_WELD,
        'Weld_Total_Min': materialDetails[i].OPTM_WELD_TOTALMINS,
        'Weld_Total_Hrs': materialDetails[i].OPTM_WELD_TOTALHRS,
        'Plumbing_Total_Min': materialDetails[i].OPTM_PLUMBING_TOTALMINS,
        'Plumbing_Total_Hrs': materialDetails[i].OPTM_PLUMBING_TOTALHRS,
        'OPTM_QUANTITY': materialDetails[i].OPTM_QUANTITY,
        'OPTM_DESCRIPTION': materialDetails[i].OPTM_DESCRIPTION,
        'rowIndex': i
      })
    }

  }

  deleteDuplicateData(index: any) {
    for (let i = 0; i < this.material_Griddata.length; i++) {
      if (this.material_Griddata[i].rowIndex == index) {
        this.UpdateSheetSummary(this.material_data[i]["MaterialCode"], parseFloat(this.material_data[i]["Thickness"]),this.material_data[i]["Material"],
        this.material_data[i]["Type"],0,parseFloat(this.material_data[i]["Total_Area"]));        
        this.material_Griddata.splice(i, 1);
        i = i - 1;
      }
    }
  }

  onMaterialCodeChange(rowIndex: any, value: any) {     
    //this.showLookupLoader = true;
    if (value == undefined || value == '') {
      //show user message to select code
      return;
    }
    this.service.getSelectedMaterialInfo(value).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data != undefined) {
          this.material_data[rowIndex]["MaterialCode"] = data.SelectedMaterialInfo[0]["OPTM_MATERIALCODE"];
          this.material_data[rowIndex]["Type"] = data.SelectedMaterialInfo[0]["OPTM_COLOR"];
          this.material_data[rowIndex]["Material"] = data.SelectedMaterialInfo[0]["OPTM_DESCRIPTION"];
          this.material_data[rowIndex]["Thickness"] = parseFloat(data.SelectedMaterialInfo[0]["OPTM_THICKNESS"]).toFixed(2);
          this.UpdateSheetSummary(this.material_data[rowIndex]["MaterialCode"], 
                                  parseFloat(this.material_data[rowIndex]["Thickness"]),
                                  this.material_data[rowIndex]["Material"],
                                  this.material_data[rowIndex]["Type"],
                                  0,
                                  parseFloat(this.material_data[rowIndex]["Total_Area"])); 
        }
        else {
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

  onSheetChange(rowIndex: any, value: any, key: any) {        
    if (key == "Sheet_Lg" || key == "Sheet_Width") {
      let numVal: number;
      if (!isNaN(value)) {
        numVal = parseFloat(value);
        if (numVal <= 0) {
          this.sheet_summary[rowIndex][key] = '0.00';
          return;
        } 
        this.sheet_summary[rowIndex][key] = numVal.toFixed(2);                
      } else {
        this.sheet_summary[rowIndex][key] = '0.00';
        return;
      } 

      if (this.sheet_summary[rowIndex]["Sheet_Lg"] != 0 && this.sheet_summary[rowIndex]["Sheet_Width"] != 0) {
        this.sheet_summary[rowIndex]["Sheet_Area"] = (parseFloat(this.sheet_summary[rowIndex]["Sheet_Lg"]) * parseFloat(this.sheet_summary[rowIndex]["Sheet_Width"])).toFixed(2)
      }
      else {
        this.sheet_summary[rowIndex]["Sheet_Area"] = '0.00';
      }
    }
    this.CalculateSheetsRequired(rowIndex);
  }

  CalculateSheetsRequired(rowIndex: number) {    
    if (this.sheet_summary[rowIndex]["Sheet_Area"] != 0) {
      if (this.sheet_summary[rowIndex]["Total_Area"] != 0) {
        this.sheet_summary[rowIndex]["Parts_Per_Sheet"] = (parseFloat(this.sheet_summary[rowIndex]["Sheet_Area"]) / parseFloat(this.sheet_summary[rowIndex]["Total_Area"])).toFixed(2)
        this.sheet_summary[rowIndex]["Sheets_Reqd"] = (parseFloat(this.sheet_summary[rowIndex]["Total_Area"]) / parseFloat(this.sheet_summary[rowIndex]["Sheet_Area"])).toFixed(2)
      }
    }
    else {
      this.sheet_summary[rowIndex]["Parts_Per_Sheet"] = '0.00';
      this.sheet_summary[rowIndex]["Sheets_Reqd"] = '0.00';
    }

  }  

  onChange(rowIndex: any, value: any, key: any) {
    if (key == "Material" || key == "Description" || key == "Type") {
      this.material_data[rowIndex][key] = value;
    } else {
      let numVal: number;
      if (!isNaN(value)) {
        numVal = parseFloat(value);
        if (numVal <= 0) {
          this.material_data[rowIndex][key] = '0.00';
          return;
        } 
        this.material_data[rowIndex][key] = numVal.toFixed(2);                
      } else {
        this.material_data[rowIndex][key] = '0.00';
        return;
      }      
    }
    
    let oldArea: number = 0;
    if (key == "Qty" || key == "Description") {
      if (this.material_data[rowIndex]["Qty"] != "" && this.material_data[rowIndex]["Description"] != "") {
        if (this.material_Griddata.length > 0) {
          this.deleteDuplicateData(rowIndex);
        }
        this.onAddRow(this.material_data[rowIndex]["Qty"], this.material_data[rowIndex]["Description"], rowIndex);
      }
    }


    console.log(this.material_data);
    if (key == "Qty" || key == "Length" || key == "Width") {
      if (this.material_data[rowIndex]["Qty"] != "" && this.material_data[rowIndex]["Length"] != "" && this.material_data[rowIndex]["Width"] != "") {
        this.material_data[rowIndex]["Area"] = (parseFloat(this.material_data[rowIndex]["Qty"]) * parseFloat(this.material_data[rowIndex]["Length"]) * parseFloat(this.material_data[rowIndex]["Width"])).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Area"] = '0.00';
      }      
    }

    if (this.material_data[rowIndex]["Total_Area"] != "") {
      oldArea = parseFloat(this.material_data[rowIndex]["Total_Area"]);
    }
    if (this.material_data[rowIndex]["Area"] != 0) {
      this.material_data[rowIndex]["Perimeter"] = (2 * (parseFloat(this.material_data[rowIndex]["Length"]) + parseFloat(this.material_data[rowIndex]["Width"]))).toFixed(2)
      this.material_data[rowIndex]["Drop"] = (parseFloat(this.material_data[rowIndex]["Area"]) * 0.18).toFixed(2);
      this.material_data[rowIndex]["Inner_Area"] = this.material_data[rowIndex]["Inner_Area"] == "" ? parseInt("0") : this.material_data[rowIndex]["Inner_Area"]
      this.material_data[rowIndex]["Total_Area"] = (parseFloat(this.material_data[rowIndex]["Area"]) + parseFloat(this.material_data[rowIndex]["Drop"])
                                  - parseFloat(this.material_data[rowIndex]["Inner_Area"])).toFixed(2)
      this.UpdateSheetSummary(this.material_data[rowIndex]["MaterialCode"], parseFloat(this.material_data[rowIndex]["Thickness"]),this.material_data[rowIndex]["Material"],
        this.material_data[rowIndex]["Type"],parseFloat(this.material_data[rowIndex]["Total_Area"]), oldArea)
    }
    else {
      this.material_data[rowIndex]["Perimeter"] = '0.00';
      this.material_data[rowIndex]["Drop"] = '0.00';
      this.material_data[rowIndex]["Total_Area"] = '0.00';

    }
    if (key == "Holes" || key == "Hole_Size") {
      if (this.material_data[rowIndex]["Holes"] != "" && this.material_data[rowIndex]["Hole_Size"] != "") {
        this.material_data[rowIndex]["Circumference"] = (parseFloat(this.material_data[rowIndex]["Holes"]) * (parseFloat(this.material_data[rowIndex]["Hole_Size"]) * 3.14)).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Circumference"] = '0.00';
      }
    }
    if (key == "Slots" || key == "Slots_Lg" || key == "Slots_Width") {
      if (this.material_data[rowIndex]["Slots"] != "" && this.material_data[rowIndex]["Slots_Lg"] != "" && this.material_data[rowIndex]["Slots_Width"] != "") {
        this.material_data[rowIndex]["Circumference1"] = (parseFloat(this.material_data[rowIndex]["Slots"]) * (parseFloat(this.material_data[rowIndex]["Slots_Lg"]) * 2) * (parseFloat(this.material_data[rowIndex]["Slots_Width"]) * 3.14)).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Circumference1"] = '0.00';
      }
    }
    if (this.material_data[rowIndex]["Qty"] == "") {
      this.material_data[rowIndex]["Qty"] = '0.00';
    }
    if (this.material_data[rowIndex]["Holes"] == "") {
      this.material_data[rowIndex]["Holes"] = '0.00';
    }
    if (this.material_data[rowIndex]["Slots"] == "") {
      this.material_data[rowIndex]["Slots"] = '0.00';
    }
    if (this.material_data[rowIndex]["Insets"] == "") {
      this.material_data[rowIndex]["Insets"] = '0.00';
    }
    this.programHrs = (parseFloat(this.material_data[rowIndex]["Qty"]) * 5 + parseFloat(this.material_data[rowIndex]["Holes"]) * 2 + 
    parseFloat(this.material_data[rowIndex]["Slots"]) * 2 + parseFloat(this.material_data[rowIndex]["Insets"]) * 5) / 60;

    if (this.material_Griddata.length >= rowIndex + 1) {
      this.material_Griddata[rowIndex]["Program"] = this.programHrs.toFixed(2);
    }

  }

  onChangegrid(rowIndex: any, value: any, key: any) {
    if (key == "Material" || key == "Description" || key == "Type") {
      this.material_Griddata[rowIndex][key] = value;
    } else {
      let numVal: number;
      if (!isNaN(value)) {
        numVal = parseFloat(value);
        if (numVal <= 0) {
          this.material_Griddata[rowIndex][key] = '0.00';
          return;
        } 
        this.material_Griddata[rowIndex][key] = numVal.toFixed(2);                
      } else {
        this.material_Griddata[rowIndex][key] = '0.00';
        return;
      }     
    }    
    
    if (key == "Design_Total_Min") {
      this.material_Griddata[rowIndex]['Design_Total_hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Design_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Deburr_Inches") {
      this.material_Griddata[rowIndex]['Deburr_Total_Min'] = (parseFloat(this.material_data[rowIndex]['Perimeter']) * parseFloat(this.material_data[rowIndex]['Qty']) / parseFloat(this.material_Griddata[rowIndex]['Deburr_Inches']))
      this.material_Griddata[rowIndex]['Deburr_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Deburr_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Fit_Min_Parts") {
      this.material_Griddata[rowIndex]['Fit_Total_Min'] = parseFloat(this.material_data[rowIndex]['Qty']) * parseFloat(this.material_Griddata[rowIndex]['Fit_Min_Parts'])
      this.material_Griddata[rowIndex]['Fit_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Fit_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Machine_Passes") {
      this.material_Griddata[rowIndex]['Machine_Total_Min'] = (parseFloat(this.material_data[rowIndex]['Perimeter']) * parseFloat(this.material_data[rowIndex]['Qty']) * parseFloat(this.material_Griddata[rowIndex]['Machine_Passes'])/80)
      this.material_Griddata[rowIndex]['Machine_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Machine_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Weld") {
      this.material_Griddata[rowIndex]['Weld_Total_Min'] = (parseFloat(this.material_data[rowIndex]['Perimeter']) * parseFloat(this.material_data[rowIndex]['Qty']) * parseFloat(this.material_Griddata[rowIndex]['Weld']) * 4) / 12;
      this.material_Griddata[rowIndex]['Weld_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Weld_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Plumbing_Total_Min") {
      this.material_Griddata[rowIndex]['Plumbing_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Plumbing_Total_Min']) * parseFloat(this.material_data[rowIndex]['Qty'])/ 60).toFixed(2)
    }
  }

  openGridTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    if (evt != "") {
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      evt.currentTarget.className += " active";
    }

    document.getElementById(cityName).style.display = "block";

  }

  onAddRow(qty: any, desc: any, index: any) {
    this.material_Griddata.push({
      'Design_Total_Min': 0,
      'Design_Total_hrs': 0,
      'Program': 0,
      'Deburr_Inches': 0,
      'Deburr_Total_Min': 0,
      'Deburr_Total_Hrs': 0,
      'Machine_Passes': 0,
      'Machine_Total_Min': 0,
      'Machine_Total_Hrs': 0,
      'Machine_SetUp_Time': 0,
      'Fit_Min_Parts': 0,
      'Fit_Total_Min': 0,
      'Fit_Total_Hrs': 0,
      'Weld': 0,
      'Weld_Total_Min': 0,
      'Weld_Total_Hrs': 0,
      'Plumbing_Total_Min': 0,
      'Plumbing_Total_Hrs': 0,
      'OPTM_QUANTITY': qty,
      'OPTM_DESCRIPTION': desc,
      'rowIndex': index
    })


  }



  onDeleteRow(rowindex) {
    if (this.material_data.length > 0) {
      for (let i = 0; i < this.material_data.length; ++i) {
        if (this.material_data[i].rowIndex === rowindex) {
          this.UpdateSheetSummary(this.material_data[i]["MaterialCode"], parseFloat(this.material_data[i]["Thickness"]),this.material_data[i]["Material"],
          this.material_data[i]["Type"],0,parseFloat(this.material_data[i]["Total_Area"])); 
          this.material_data.splice(i, 1);
          i = i - 1;
          this.index = this.index - 1;
          this.deleteDuplicateData(rowindex);
        }
      }
    }
  }


  getLookupValue($event) {
    if ($event.length == 0) {
      this.lookupfor = "";
      return;
    }
    CommonData.made_changes = true;
    let productCode = $event[2];
    this.lookupfor = "";
    this.fetchFullProducts(productCode);

  }


  fetchFullProducts(productCode: any) {
    this.showLookupLoader = true;
    this.service.getMaterialDetails(productCode).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data != undefined) {
          this.fetchData = data;
          this.setEditData();
        }
        else {

          this.fetchData = [];
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

  fetchProducts() {
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'Product_Details';
    this.showLookupLoader = true;
    this.service.getProductlDetails().subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data.length > 0) {
          this.serviceData = data;
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

  onDeletGrideRow(rowindex) {
    if (this.material_Griddata.length > 0) {
      for (let i = 0; i < this.material_Griddata.length; ++i) {
        if (this.material_Griddata[i].rowIndex === rowindex) {
          this.material_Griddata.splice(i, 1);
          i = i - 1;
          this.gridIndex = this.gridIndex - 1;
        }
      }
    }
  }

  resetFields() {
    this.material_Griddata = [];
    this.material_data = [];
    this.SheetGridRow=[];
    this.index = 0;
    this.gridIndex = 0;
    this.product_code = "";
    this.product_name = "";
  }

  onSave() {
    let OPCONFIG_MATERIALHEADER = [];
    OPCONFIG_MATERIALHEADER.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser"),
      "OPTM_DESCRIPTION": this.product_name,
      "OPTM_CODE": this.product_code,
      CompanyDBID: sessionStorage.getItem("selectedComp"),
    })
    this.material_Griddata = this.material_Griddata.filter(function (obj) {
      obj['Design_Total_Min'] = parseInt(obj['Design_Total_Min'])
      obj['Deburr_Total_Min'] = parseInt(obj['Deburr_Total_Min'])
      obj['Machine_Total_Min'] = parseInt(obj['Machine_Total_Min'])
      obj['Fit_Total_Min'] = parseInt(obj['Fit_Total_Min'])
      obj['Weld_Total_Min'] = parseInt(obj['Weld_Total_Min'])
      obj['Plumbing_Total_Min'] = parseInt(obj['Plumbing_Total_Min'])

      return obj;
    });
    this.showLookupLoader = true;
    this.service.SaveMaterial(OPCONFIG_MATERIALHEADER, this.material_data, this.material_Griddata, this.sheet_summary).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            CommonData.made_changes = false;

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.router, 'Sessionout');
            return;
          }
        }
        if (data === "True") {
          CommonData.made_changes = false
          this.CommonService.show_notification(this.language.DataSaved, 'success');
          this.resetFields();
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
