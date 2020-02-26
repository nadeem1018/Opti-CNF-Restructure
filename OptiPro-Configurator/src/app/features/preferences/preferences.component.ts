import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/common.service';
import { DialogService } from 'src/app/core/service/dialog.service';
import { CommonData } from 'src/app/core/data/CommonData';
import { PreferencesService } from 'src/app/core/service/preference.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  public commonData = new CommonData();
	language = JSON.parse(sessionStorage.getItem('current_lang'));
  public settings_data: any = [];
  public view_route_link = '/home';
	constructor(
    private router: ActivatedRoute, 
    private route: Router,
    private preferencesService: PreferencesService,
    private commanService: CommonService, 
    private DialogService: DialogService) { }
	public page_main_title = this.language.preferences
	public made_changes: boolean = false;
	public isUpdateButtonVisible: boolean = true;
	public isMobile: boolean = false;
	public isIpad: boolean = false;
	public isDesktop: boolean = true;
	public isPerfectSCrollBar: boolean = false;
	public showLoader: boolean = true;
	public showLookupLoader: boolean = false;	
	public loggedin_user:string = "";
	public current_commpany:string = "";

  canDeactivate() {
		if(CommonData.made_changes == true){
			return this.DialogService.confirm('');
		} else {
			return true;
		}
	}

	detect_change(){
		CommonData.made_changes = true;
  }

  ngOnInit() {
    this.showLoader = true;
		this.loggedin_user = sessionStorage.getItem('loggedInUser');
		this.current_commpany = sessionStorage.getItem('selectedComp');
		this.preferencesService.get_all_preferences().subscribe(
			data => {
				if (data != undefined) {
					if (data[0].ErrorMsg == "7001") {
						CommonData.made_changes = false;
						this.commanService.RemoveLoggedInUser().subscribe();
						this.commanService.signOut(this.route, 'Sessionout');
						return;
					}
				}

				if(data.length > 0){
					let temp_obj = [];
					for (var si = 0; si < data.length; si++) {
						temp_obj[data[si]['NAME']] = data[si]['VALUE'];
					}
					this.settings_data = temp_obj;
				}
				this.showLoader = false;
			},
			error => {
				this.showLoader = false;
			});

  }
  onCancel(){
    this.route.navigateByUrl('home');
  }
  
  onUpdateClick(){
		let report_data_save: any = {};
		report_data_save.settingdata = [];
		report_data_save.apidata = [];
		report_data_save.connectiondetails = [];
		let temp = {};
		if(this.settings_data.report_hidden_item_text.trim().length==0){
      this.commanService.show_notification(this.language.hidden_item_text_on_report_blank, 'error');	
	  	return;
		}
		this.showLookupLoader = true;
		for(let index in this.settings_data){
			temp = {
				"NAME"  : index,
				"VALUE" : this.settings_data[index]
			};
			report_data_save.settingdata.push(temp);
		}

		report_data_save.connectiondetails.push({
			CompanyDBID: this.current_commpany,
			Username: this.loggedin_user,
		});

		report_data_save.apidata.push({
			GUID: sessionStorage.getItem("GUID"),
			UsernameForLic: this.loggedin_user
		});

		this.preferencesService.save_update_preferences(report_data_save).subscribe(
			data => {
				this.showLookupLoader = false;
				if (data != null && data != undefined) {
					if(data.length > 0 && data != undefined){
						if (data[0].ErrorMsg == "7001") {
							this.made_changes = false;
							this.commanService.RemoveLoggedInUser().subscribe();
							this.commanService.signOut(this.route, 'Sessionout');
							return;
						}
					}
				}

				if (data[0].Status == "True") {
          this.commanService.show_notification(this.language.DataUpdateSuccesfully, 'success'); 
					this.route.navigateByUrl(this.view_route_link);
				} else {
          this.commanService.show_notification(this.language.DataNotUpdated, 'error');				
					return;
				}
			}, error => {
        this.showLoader = false;
        this.commanService.show_notification(this.language.server_error, 'error');				
				return;
				
			});
	}

}
