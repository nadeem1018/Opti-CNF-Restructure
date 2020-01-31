import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonData } from 'src/app/core/data/CommonData';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';
// import { HttpClient } from 'selenium-webdriver/http';
import { CommonService } from 'src/app/core/service/common.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { HttpClient } from 'selenium-webdriver/http';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	@ViewChild("usernameref", { static: true }) _el: ElementRef;
	public licenseData: any = [];
	public loginCredentials: any = [];
	public psURL: string = '';
	public showCompDropDown: boolean = false;
	public showLoginBtn: boolean = false;
	public config_params: any;
	public assignedCompanies: any;
	public selecetedComp: any;
	public disbleConnectBtn: boolean = true;
	public config_data: any = [];
	public connectBtnText = "Connect";
	public language: any = [];
	private commonData = new CommonData();
	public login = "";
	public titleInfo = "";
	public username = "";
	public isUsernameBlank = "";
	public password = "";
	public isPasswordBlank = "";
	public login_btn = "";
	public reset_button_text = "";
	public UserNotActive = "";
	public InvalidCredentials = "";
	public CompanyRequired = "";
	public UserNameRequired = "";
	public PasswordRequired = "";
	public default_server_error_msg = "";
	public license_failed = "";
	public isUserPermitted = "";
	public FailedToReadCurrency = "";
	public onConnectSuccess: boolean = false;
	public page_title = this.commonData.project_name;
	public project_name = "";
	public showLoginLoader: boolean = true;
	public connectButtonLoader: boolean = false;

	public appVersion: any;
	// common_params = new CommonData();
	record_per_page: any = this.commonData.default_count;
	current_url: any;
	constructor(
		private auth: AuthService,
		private router: Router,
		private notificationService: NotificationService,
		private CommonService: CommonService
	) { }


	ngOnInit() {
		this._el.nativeElement.focus();
		this.selecetedComp = "";
		let objj = this;
		setTimeout(function () {
			objj.config_data = JSON.parse(sessionStorage.getItem('system_config'));
			objj.language = JSON.parse(sessionStorage.getItem('current_lang'));
			if (objj.config_data != null) {
				if (objj.language != null) {
					objj.showLoginLoader = true;
					objj.CommonService.get_config(function (response) {
						objj.appVersion = objj.config_data.system_version;
						objj.CommonService.set_language(response, function () {
							objj.config_data = JSON.parse(sessionStorage.getItem('system_config'));
							if (objj.config_data != undefined && objj.config_data != "") {
								objj.project_name = objj.config_data['app_title'];
								objj.language = JSON.parse(sessionStorage.getItem('current_lang'));
								objj.setDefaultLanguage();
								objj.showLoginLoader = false;
							}
						});
					});

				}
			}

		}, 2000);
        this.CommonService.get_config(function(response){
            objj.CommonService.set_language(response, function(){
                objj.config_data = JSON.parse(sessionStorage.getItem('system_config'));
                if (objj.config_data != undefined && objj.config_data != "") {
               		objj.language = JSON.parse(sessionStorage.getItem('current_lang'));
                	objj.setDefaultLanguage()
                }
            })
        });
        this.current_url = this.commonData.get_current_url();
		if (sessionStorage.getItem('isLoggedIn') == 'true') {
			this.router.navigateByUrl('/home');
		} 
	}

	setDefaultLanguage() {


		this.connectBtnText = this.language.connect;
		this.login = this.language.login;
		this.titleInfo = this.language.titleInfo;
		this.username = this.language.username;
		this.isUsernameBlank = this.language.isUsernameBlank;
		this.password = this.language.password;
		this.isPasswordBlank = this.language.isPasswordBlank;
		this.login_btn = this.language.login;
		this.reset_button_text = this.language.reset;
		this.UserNotActive = this.language.UserNotActive;
		this.InvalidCredentials = this.language.InvalidCredentials;
		this.CompanyRequired = this.language.CompanyRequired;
		this.UserNameRequired = this.language.UserNameRequired;
		this.PasswordRequired = this.language.PasswordRequired;
		this.default_server_error_msg = this.language.server_error;
		this.license_failed = this.language.license_failed;
		this.isUserPermitted = this.language.isUserPermitted;
		this.FailedToReadCurrency = this.language.FailedToReadCurrency;
	}

	/*  ngAfterViewInit() {}
	*/
	enter_to_sublit(event) {
		if (event.keyCode == 13) {
			if (this.selecetedComp != undefined && this.selecetedComp != "") {
				// this.onLoginBtnPress();
				this.getLisenceData();
			} else {
				this.onConnectBtnPress();
			}
		}
	}

	//Events
	onConnectBtnPress() {
		if (this.loginCredentials.userName == undefined || this.loginCredentials.userName == null) {
			this.CommonService.show_notification(this.language.UserNameRequired, 'warning');
			return;
		}
		if (this.loginCredentials.password == undefined || this.loginCredentials.password == null) {
			this.CommonService.show_notification(this.language.UserNameRequired, 'warning');
			return;
		}
		if (this.loginCredentials.userName != undefined && this.loginCredentials.password != undefined) {
			this.connectButtonLoader = true;
			this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
			this.auth.login(this.loginCredentials, this.config_params.service_url).subscribe(
				data => {
					console.log(data);
					if (data != null || data.Table.length > 0) {
						if (data.Table.length > 0) {
							var access_token = data.AuthenticationDetails[0].token_type + " " + data.AuthenticationDetails[0].access_token;

							sessionStorage.setItem('authToken', access_token);

							if (data.Table[0].OPTM_ACTIVE == 1) {

								this.connectBtnText = (this.language.connected != undefined) ? this.language.connected : "Connected";
								//If everything is ok then we will get comapnies
								this.getCompanies();
							}
							else {
								//If user is not active
								this.connectButtonLoader = false;
								this.CommonService.show_notification(this.language.UserNotActive, 'warning');
							}
						}
						else {
							//If no table found
							this.connectButtonLoader = false;
							this.CommonService.show_notification(this.language.InvalidCredentials, 'error');
						}
					} else {
						//If no username & pass matches
						this.connectButtonLoader = false;
						this.CommonService.show_notification(this.language.InvalidCredentials, 'error');
					}
				}, error => {
					this.connectButtonLoader = false;
					if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
						this.CommonService.isUnauthorized();
					}
					return;
				})
		}

	}
	onLoginBtnPress() {
		if (this.selecetedComp == undefined && this.selecetedComp == "") {
			this.CommonService.show_notification(this.language.CompanyRequired, 'warning');
			return;
		}
		else {
			//This will get the currency code from db
			this.getCurrencyCode(this.selecetedComp.OPTM_COMPID);
			if (this.selecetedComp.OPTM_COMPID == undefined) {
				this.CommonService.show_notification(this.language.CompanyRequired, 'warning');
				return;
			}

			sessionStorage.setItem('selectedComp', this.selecetedComp.OPTM_COMPID);
			sessionStorage.setItem('loggedInUser', this.loginCredentials.userName);
			sessionStorage.setItem('defaultRecords', this.record_per_page);
			sessionStorage.setItem('isLoggedIn', "true");
			sessionStorage.setItem('isFilterEnabled', "false");


			this.CommonService.setisLoggedInData();

			sessionStorage.setItem('defaultCurrency', "$");

			//window.location.href = home_page;
			this.router.navigateByUrl('/home');
		}
	}

	getLisenceData() {
		if (this.selecetedComp == undefined || this.selecetedComp == "") {
			this.CommonService.show_notification(this.language.CompanyRequired, 'warning');
			return;
		} else {

			this.showLoginLoader = true;
			this.auth.getLicenseData(this.selecetedComp.OPTM_COMPID, this.loginCredentials).subscribe(
				data => {
					if (data != undefined) {
						this.licenseData = data;
						this.handleLicenseDataSuccessResponse();
					} else {
						//  alert("Lisence Failed");
						this.showLoginLoader = false;
						this.CommonService.show_notification(this.language.license_failed, 'error');
					}
					// this.licenseData = data;

				},
				error => {
					// this.showLoader = false;
					this.showLoginLoader = false;
					if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
						this.CommonService.isUnauthorized();
					} else {
						this.CommonService.show_notification(this.language.license_failed, 'error');
					}
					return;
				}
			);
		}
	}

	private handleLicenseDataSuccessResponse() {
		if (this.licenseData.length > 0) {
			if (this.licenseData[0].ErrMessage == "" || this.licenseData[0].ErrMessage == null) {
				sessionStorage.setItem("GUID", this.licenseData[0].GUID);
				sessionStorage.setItem("Token", this.licenseData[0].Token);
				this.onLoginBtnPress();

			} else {
				this.showLoginLoader = false;
				this.CommonService.show_notification(this.licenseData[0].ErrMessage, 'error');
			}
		} else {
			this.showLoginLoader = false;			
			this.CommonService.show_notification(this.licenseData[0].ErrMessage, 'error');
		}
	}

	//to get the companies assigned to user
	getCompanies() {
		this.auth.getCompany(this.loginCredentials, this.config_params.service_url).subscribe(
			data => {
				this.connectButtonLoader = false;
				if (data != null || data != undefined) {
					this.assignedCompanies = data.Table;
					this.connectButtonLoader = false;
					if (this.assignedCompanies != null) {
						//If comp found
						this.showCompDropDown = true;
						this.showLoginBtn = true;
						this.onConnectSuccess = true;
					}
					else {
						//If no companies found then will hide elements
						this.onConnectSuccess = false;
						this.showLoginBtn = false;
						this.showCompDropDown = false;
					}
				} else {
					//if No companies are retriving then we will consider that user have no company assignment
					// alert("You Don't have Permission to Access this Product");
					this.connectButtonLoader = false;
					this.CommonService.show_notification(this.language.isUserPermitted, 'error');
				}
			}, error => {
				this.connectButtonLoader = false;
				this.CommonService.show_notification(this.language.default_server_error_msg, 'error');
				return;
			}
		)
	}

	onResetClick() {
		this.onConnectSuccess = false;
		this.showLoginBtn = false;
		this.showCompDropDown = false;
		this.loginCredentials = [];
		this.loginCredentials.length = 0;
		this.selecetedComp = [];
		this.connectBtnText = (this.language.connect != undefined) ? this.language.connect : "Connect";
	}

	//Get Currency code from backend
	getCurrencyCode(selectedCompID) {
		sessionStorage.setItem('defaultCurrency', "$");
		if (this.config_params == undefined || this.config_params == "") {
			this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
		}
		this.CommonService.GetCompanyDetails(selectedCompID).subscribe(
			data => {
				if (data != null || data != undefined) {
					if (data.length > 0) {
						if (data[0].HomeCurrency != "" && data[0].HomeCurrency != null && data[0].HomeCurrency != undefined) {
							sessionStorage.setItem('defaultCurrency', data[0].HomeCurrency);
						}
					}
				}
			}, error => {
				this.showLoginLoader = false;
				if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
					this.CommonService.isUnauthorized();
				}
				return;
			}
		)
	}

}
