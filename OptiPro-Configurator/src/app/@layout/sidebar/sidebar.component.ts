import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from 'src/app/core/data/CommonData';
import { CommonService } from 'src/app/core/service/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navList:Array<Object> = [];

  constructor(
  private router: Router,
  private CommonService: CommonService
    ) { }
  public commonData = new CommonData();
  public language = JSON.parse(sessionStorage.getItem('current_lang'));
  ngOnInit() {
    let temp_menu_data = [  
      { "itemCode": "0", "itemName": this.language.dashboard, "itemNav": "/home", "itemIcon": "#home", "itemIconSize": "0 0 512 512", "permission":true},
      { "itemCode": "200", "itemName": this.language.itemcodegeneration, "itemNav": "/item-code-generation", "itemIcon": "#code", "itemIconSize": "0 0 612 619.2", "permission":true},
      { "itemCode": "201", "itemName": this.language.model_feature_master, "itemNav": "/feature", "itemIcon": "#featureModal", "itemIconSize": "0 0 512 512", "permission":true},
      { "itemCode": "202", "itemName": this.language.feature_Bom, "itemNav": "/feature-bom", "itemIcon": "#featureBom", "itemIconSize": "0 0 395.636 395.636", "permission":true},
      { "itemCode": "203", "itemName": this.language.Model_Bom, "itemNav": "/model-bom", "itemIcon": "#modelBom", "itemIconSize": "0 0 512 512", "permission":true},
      { "itemCode": "206", "itemName": this.language.routing, "itemNav": "/routing", "itemIcon": "#routing", "itemIconSize": "0 0 32 32", "permission":true},
      { "itemCode": "204", "itemName": this.language.rule_workbench, "itemNav": "/rule-work-bench", "itemIcon": "#ruleWorkBench", "itemIconSize": "0 0 504.123 504.123", "permission":true},
      { "itemCode": "207", "itemName": this.language.archiving, "itemNav": "/archive", "itemIcon": "#archive", "itemIconSize": "0 0 58 58", "permission":true},
      { "itemCode": "205", "itemName": this.language.config_wizard, "itemNav": "/configuration-wizard", "itemIcon": "#configure", "itemIconSize": "0 0 512 512", "permission":true},
    ];
    let allowed_menus_ids =["0"];
    this.CommonService.getMenuRecord().subscribe(
      menu_items => {
       for(let menu_item of menu_items){
         allowed_menus_ids.push(menu_item.OPTM_MENUID);
       }
       for(let menu_data of temp_menu_data){
        if(allowed_menus_ids.indexOf(menu_data.itemCode) !== -1){
          this.navList.push(menu_data);
        }
       }
      }, error =>{
        if(error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage){
          this.CommonService.isUnauthorized();
        } else {
          this.CommonService.show_notification(this.language.server_error, 'error');
        }
        return
      });
      
    
  }

  // Close sidebar when siderbar item clicked in case of mobile/tablet devices
  public sidebarCloseMobile(): void {
    if(window.innerWidth <= 991){
      document.getElementById("sidebar-wrapper").classList.remove("toggle");
    }
  }

  public sidebarCloseMobileWithRefresh(): void {
    if(window.innerWidth <= 991){
      document.getElementById("sidebar-wrapper").classList.remove("toggle");
    }
  }

}
