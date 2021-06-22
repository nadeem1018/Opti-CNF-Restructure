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

  constructor(private router: Router, private httpclient: HttpClient, private CommonService: CommonService, private service: EstimatetoolService) { }

  ngOnInit() {
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
      'rowIndex': this.index
    })
    this.index = this.index + 1;

  }

  onChange(rowIndex: any, value: any, key: any) {
    this.material_data[rowIndex][key] = value;
    console.log(this.material_data);
    if (key == "Qty" || key == "Length" || key == "Width") {
      if (this.material_data[rowIndex]["Qty"] != "" && this.material_data[rowIndex]["Length"] != "" && this.material_data[rowIndex]["Width"] != "") {
        this.material_data[rowIndex]["Area"] = parseFloat(this.material_data[rowIndex]["Qty"]) * parseFloat(this.material_data[rowIndex]["Length"]) * parseFloat(this.material_data[rowIndex]["Width"])
      }
      else {
        this.material_data[rowIndex]["Area"] = "";
      }
    }
    if (this.material_data[rowIndex]["Area"] != "") {
      this.material_data[rowIndex]["Perimeter"] = 2 * (parseFloat(this.material_data[rowIndex]["Length"]) + parseFloat(this.material_data[rowIndex]["Width"]))
      this.material_data[rowIndex]["Drop"] = parseFloat(this.material_data[rowIndex]["Area"]) * 0.18;
      this.material_data[rowIndex]["Inner_Area"] = this.material_data[rowIndex]["Inner_Area"] == "" ? parseInt("0") : this.material_data[rowIndex]["Inner_Area"]
      this.material_data[rowIndex]["Total_Area"] = parseFloat(this.material_data[rowIndex]["Qty"]) * (parseFloat(this.material_data[rowIndex]["Area"]) + parseFloat(this.material_data[rowIndex]["Drop"])) - parseFloat(this.material_data[rowIndex]["Inner_Area"])
    }
    else {
      this.material_data[rowIndex]["Perimeter"] = "";
      this.material_data[rowIndex]["Drop"] = "";
      this.material_data[rowIndex]["Total_Area"] = "";

    }
    if (key == "Holes" || key == "Hole_Size") {
      if (this.material_data[rowIndex]["Holes"] != "" && this.material_data[rowIndex]["Hole_Size"] != "") {
        this.material_data[rowIndex]["Circumference"] = parseFloat(this.material_data[rowIndex]["Holes"]) * (parseFloat(this.material_data[rowIndex]["Hole_Size"]) * 3.14)
      }
      else {
        this.material_data[rowIndex]["Circumference"] = "";
      }
    }
    if (key == "Slots" || key == "Slots_Lg" || key == "Slots_Width") {
      if (this.material_data[rowIndex]["Slots"] != "" && this.material_data[rowIndex]["Slots_Lg"] != "" && this.material_data[rowIndex]["Slots_Width"] != "") {
        this.material_data[rowIndex]["Circumference1"] = parseFloat(this.material_data[rowIndex]["Slots"]) * (parseFloat(this.material_data[rowIndex]["Slots_Lg"]) * 2) * (parseFloat(this.material_data[rowIndex]["Slots_Width"]) * 3.14)
      }
      else {
        this.material_data[rowIndex]["Circumference1"] = "";
      }
    }
    if (key == "Sheet_Lg" || key == "Sheet_Width") {
      if (this.material_data[rowIndex]["Sheet_Lg"] != "" && this.material_data[rowIndex]["Sheet_Width"] != "") {
        this.material_data[rowIndex]["Sheet_Area"] = parseFloat(this.material_data[rowIndex]["Sheet_Lg"]) * parseFloat(this.material_data[rowIndex]["Sheet_Width"])
      }
      else {
        this.material_data[rowIndex]["Sheet_Area"] = "";
      }
    }
    if (this.material_data[rowIndex]["Sheet_Area"] != "") {
      if (this.material_data[rowIndex]["Thickness"] != "") {
        if (this.material_data[rowIndex]["Total_Area"] != "") {
          this.material_data[rowIndex]["Parts_Per_Sheet"] = (parseFloat(this.material_data[rowIndex]["Thickness"]) * parseFloat(this.material_data[rowIndex]["Sheet_Area"])) / parseFloat(this.material_data[rowIndex]["Total_Area"])
          this.material_data[rowIndex]["Sheets_Reqd"] = parseFloat(this.material_data[rowIndex]["Total_Area"]) / (parseFloat(this.material_data[rowIndex]["Thickness"]) * parseFloat(this.material_data[rowIndex]["Sheet_Area"]))
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
      this.material_Griddata[rowIndex]['Design_Total_hrs'] = parseFloat(this.material_Griddata[rowIndex]['Design_Total_Min']) / 60
    }
    if (key == "Deburr_Total_Min") {
      this.material_Griddata[rowIndex]['Deburr_Total_Hrs'] = parseFloat(this.material_Griddata[rowIndex]['Deburr_Total_Min']) / 60
    }
    if (key == "Fit_Total_Min") {
      this.material_Griddata[rowIndex]['Fit_Total_Hrs'] = parseFloat(this.material_Griddata[rowIndex]['Fit_Total_Min']) / 60
    }
    if (key == "Machine_Total_Min") {
      this.material_Griddata[rowIndex]['Machine_Total_Hrs'] = parseFloat(this.material_Griddata[rowIndex]['Machine_Total_Min']) / 60
    }
    if (key == "Weld_Total_Min") {
      this.material_Griddata[rowIndex]['Weld_Total_Hrs'] = parseFloat(this.material_Griddata[rowIndex]['Weld_Total_Min']) / 60
    }
    if (key == "Plumbing_Total_Min") {
      this.material_Griddata[rowIndex]['Plumbing_Total_Hrs'] = parseFloat(this.material_Griddata[rowIndex]['Plumbing_Total_Min']) / 60
    }
  }

  openGridTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  onAddRow() {
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
      'rowIndex': this.gridIndex
    })

    this.gridIndex = this.gridIndex + 1;
  }



  onDeleteRow(rowindex) {
    if (this.material_data.length > 0) {
      for (let i = 0; i < this.material_data.length; ++i) {
        if (this.material_data[i].rowIndex === rowindex) {
          this.material_data.splice(i, 1);
          i = i - 1;
          this.index = this.index - 1;
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
    this.service.getNeedAssesmentTemplateList().subscribe(
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

  fetchProducts() {
    CommonData.made_changes = true;
    this.serviceData = []
    this.lookupfor = 'Product_Details';
    this.showLookupLoader = true;
    this.service.getNeedAssesmentTemplateList().subscribe(
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
          return;
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



}
