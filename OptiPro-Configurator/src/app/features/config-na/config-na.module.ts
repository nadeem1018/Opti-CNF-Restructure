import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfigurationNeedAssesmentComponent} from './configuration-need-assesment/configuration-need-assesment.component';


import { SharedModules } from 'src/app/shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ConfigurationNeedAssesmentRoutingModule } from './config-na-routing.module';


@NgModule({
  declarations: [ConfigurationNeedAssesmentComponent],

  imports: [
    CommonModule,
    ConfigurationNeedAssesmentRoutingModule,
    LayoutModule,
    SharedModules    
  ],

  entryComponents: [ConfigurationNeedAssesmentComponent]
})
export class ConfigurationNeedAssesmentModule { }