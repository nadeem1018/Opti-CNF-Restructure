import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estimet-sheet',
  templateUrl: './estimet-sheet.component.html',
  styleUrls: ['./estimet-sheet.component.scss']
})
export class EstimetSheetComponent implements OnInit {
  public nXP_Chandler_Site : any = ""
  public part_Number: any = "";
  public Project_Description: any = "";
  public quantity: any = "";
  public sales_Representative: any = "";
  public Phone_Number: any = "";
  public project_email: any = "";
  public estimator: any = "";
  public estimate_Number: any = "";
  public shipping: any = "";
  public warehouse_Manager: any = "";
  public shipping_Address_1: any = "";
  public shipping_Address_2: any = "";
  public city: any = "";
  public Phone_1: any = "";
  public phone_2: any = "";
  public shipping_email: any = "";
  public estimate_Due_Date: any = "";
  public project_Due_Date: any = "";
  public submittal_Required: any = "";
  public submittal_Due_Date: any = "";
  public ready_to_Ship_Date: any = "";
  public on_site_date: any = "";
  public alp: any = "";
  public total_Cost: any = "";
  public per_Unit_Cost: any = "";
  public subtotal: any = "";
  public overhead: any = "";
  public expedite_Fee: any = "";
  public total_Price: any = "";
  public per_Unit_Price: any = "";



  constructor() { }

  ngOnInit() {
    this.openGridTab('','Material');
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

}
