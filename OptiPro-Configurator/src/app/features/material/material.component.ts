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
  public material_Griddata = [];
  public index = 0;
  public page_main_title = "Material Master"
  public gridIndex = 0;
  public product_code = "";
  public serviceData = [];
  public lookupfor = "";
  public product_name = "";
  public showLookupLoader = false;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public fetchData: any = [];

  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: EstimatetoolService) { }

  ngOnInit() {
    this.openGridTab('', 'Material');
  }

  addRow() {


    this.material_data.push({
      'Thickness': "",
      'Material': "",
      'Type': "",
      'Description': "",
      'Length': "",
      'Width': "",
      'Area': "",
      'Perimeter': "",
      'Drop': "",
      'Total_Area': "",
      'Inner_Area': "",
      'Holes': "",
      'Hole_Size': "",
      'Circumference': "",
      'Slots': "",
      'Slots_Lg': "",
      'Slots_Width': "",
      'Circumference1': "",
      'Insets': "",
      'Sheet_Width': "",
      'Sheet_Lg': "",
      'Sheet_Area': "",
      'Parts_Per_Sheet': "",
      'Sheets_Reqd': "",
      'Qty': "",
      'rowIndex': this.index,
      'OPTM_LINENO':this.index
    })
    this.index = this.index + 1;

  }

  setEditData() {
    let materialData = this.fetchData.Material;
    let materialDetails = this.fetchData.MaterialDetails;
    let materialHeader = this.fetchData.MateriaHeader;
    this.product_name = materialHeader[0].OPTM_DESCRIPTION;
    this.product_code = materialHeader[0].OPTM_CODE;


    for (let i = 0; i < materialData.length; i++) {
      this.material_data.push({
        'Thickness': materialData[i].OPTM_THICKNESS,
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
        'Sheet_Width': materialData[i].OPTM_SHEET_WIDTH,
        'Sheet_Lg': materialData[i].OPTM_SHEET_LENGTH,
        'Sheet_Area': materialData[i].OPTM_SHEET_AREA,
        'Parts_Per_Sheet': materialData[i].OPTM_PARTSPER_SHEET,
        'Sheets_Reqd': materialData[i].OPTM_SHEETREQ,
        'Qty': materialData[i].OPTM_QUANTITY,
        'OPTM_LINENO':materialData[i].OPTM_LINENO,
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
        'rowIndex': i,
        'OPTM_LINENO':materialDetails[i].OPTM_LINENO
      })
    }

  }

  deleteDuplicateData(index: any) {
    for (let i = 0; i < this.material_Griddata.length; i++) {
      if (this.material_Griddata[i].rowIndex == index) {
        this.material_Griddata.splice(i, 1);
        i = i - 1;
      }
    }
  }

  onChange(rowIndex: any, value: any, key: any) {
    this.material_data[rowIndex][key] = value;
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
        this.material_data[rowIndex]["Area"] = "";
      }
    }
    if (this.material_data[rowIndex]["Area"] != "") {
      this.material_data[rowIndex]["Perimeter"] = (2 * (parseFloat(this.material_data[rowIndex]["Length"]) + parseFloat(this.material_data[rowIndex]["Width"]))).toFixed(2)
      this.material_data[rowIndex]["Drop"] = (parseFloat(this.material_data[rowIndex]["Area"]) * 0.18).toFixed(2);
      this.material_data[rowIndex]["Inner_Area"] = this.material_data[rowIndex]["Inner_Area"] == "" ? parseInt("0") : this.material_data[rowIndex]["Inner_Area"]
      this.material_data[rowIndex]["Total_Area"] = (parseFloat(this.material_data[rowIndex]["Qty"]) * (parseFloat(this.material_data[rowIndex]["Area"]) + parseFloat(this.material_data[rowIndex]["Drop"])) - parseFloat(this.material_data[rowIndex]["Inner_Area"])).toFixed(2)
    }
    else {
      this.material_data[rowIndex]["Perimeter"] = "";
      this.material_data[rowIndex]["Drop"] = "";
      this.material_data[rowIndex]["Total_Area"] = "";

    }
    if (key == "Holes" || key == "Hole_Size") {
      if (this.material_data[rowIndex]["Holes"] != "" && this.material_data[rowIndex]["Hole_Size"] != "") {
        this.material_data[rowIndex]["Circumference"] = (parseFloat(this.material_data[rowIndex]["Holes"]) * (parseFloat(this.material_data[rowIndex]["Hole_Size"]) * 3.14)).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Circumference"] = "";
      }
    }
    if (key == "Slots" || key == "Slots_Lg" || key == "Slots_Width") {
      if (this.material_data[rowIndex]["Slots"] != "" && this.material_data[rowIndex]["Slots_Lg"] != "" && this.material_data[rowIndex]["Slots_Width"] != "") {
        this.material_data[rowIndex]["Circumference1"] = (parseFloat(this.material_data[rowIndex]["Slots"]) * (parseFloat(this.material_data[rowIndex]["Slots_Lg"]) * 2) * (parseFloat(this.material_data[rowIndex]["Slots_Width"]) * 3.14)).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Circumference1"] = "";
      }
    }
    if (key == "Sheet_Lg" || key == "Sheet_Width") {
      if (this.material_data[rowIndex]["Sheet_Lg"] != "" && this.material_data[rowIndex]["Sheet_Width"] != "") {
        this.material_data[rowIndex]["Sheet_Area"] = (parseFloat(this.material_data[rowIndex]["Sheet_Lg"]) * parseFloat(this.material_data[rowIndex]["Sheet_Width"])).toFixed(2)
      }
      else {
        this.material_data[rowIndex]["Sheet_Area"] = "";
      }
    }
    if (this.material_data[rowIndex]["Sheet_Area"] != "") {
      if (this.material_data[rowIndex]["Thickness"] != "") {
        if (this.material_data[rowIndex]["Total_Area"] != "") {
          this.material_data[rowIndex]["Parts_Per_Sheet"] = ((parseFloat(this.material_data[rowIndex]["Thickness"]) * parseFloat(this.material_data[rowIndex]["Sheet_Area"])) / parseFloat(this.material_data[rowIndex]["Total_Area"])).toFixed(2)
          this.material_data[rowIndex]["Sheets_Reqd"] = (parseFloat(this.material_data[rowIndex]["Total_Area"]) / (parseFloat(this.material_data[rowIndex]["Thickness"]) * parseFloat(this.material_data[rowIndex]["Sheet_Area"]))).toFixed(2)
        }
      }

    }
    else {
      this.material_data[rowIndex]["Parts_Per_Sheet"] = "";
      this.material_data[rowIndex]["Sheets_Reqd"] = "";
    }

  }

  onChangegrid(rowIndex: any, value: any, key: any) {
    this.material_Griddata[rowIndex][key] = value;
    if (key == "Design_Total_Min") {
      this.material_Griddata[rowIndex]['Design_Total_hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Design_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Deburr_Total_Min") {
      this.material_Griddata[rowIndex]['Deburr_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Deburr_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Fit_Total_Min") {
      this.material_Griddata[rowIndex]['Fit_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Fit_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Machine_Total_Min") {
      this.material_Griddata[rowIndex]['Machine_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Machine_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Weld_Total_Min") {
      this.material_Griddata[rowIndex]['Weld_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Weld_Total_Min']) / 60).toFixed(2)
    }
    if (key == "Plumbing_Total_Min") {
      this.material_Griddata[rowIndex]['Plumbing_Total_Hrs'] = (parseFloat(this.material_Griddata[rowIndex]['Plumbing_Total_Min']) / 60).toFixed(2)
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
      'Design_Total_Min': "",
      'Design_Total_hrs': "",
      'Program': "",
      'Deburr_Inches': "",
      'Deburr_Total_Min': "",
      'Deburr_Total_Hrs': "",
      'Machine_Passes': "",
      'Machine_Total_Min': "",
      'Machine_Total_Hrs': "",
      'Machine_SetUp_Time': "",
      'Fit_Min_Parts': "",
      'Fit_Total_Min': "",
      'Fit_Total_Hrs': "",
      'Weld': "",
      'Weld_Total_Min': "",
      'Weld_Total_Hrs': "",
      'Plumbing_Total_Min': "",
      'Plumbing_Total_Hrs': "",
      'OPTM_QUANTITY': qty,
      'OPTM_DESCRIPTION': desc,
      'rowIndex': index,
      'OPTM_LINENO':index
    })


  }



  onDeleteRow(rowindex) {
    if (this.material_data.length > 0) {
      for (let i = 0; i < this.material_data.length; ++i) {
        if (this.material_data[i].rowIndex === rowindex) {
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
    let productCode = $event[1];
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
    this.service.SaveMaterial(OPCONFIG_MATERIALHEADER, this.material_data, this.material_Griddata).subscribe(
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
          this.material_Griddata = [];
          this.material_data = [];
          this.index = 0;
          this.gridIndex = 0;
          this.product_code = "";
          this.product_name = "";
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
