import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfigurationNeedAssesmentComponent} from './configuration-need-assesment/configuration-need-assesment.component';
import {ConfigurationNeedAssesmentRoutingModule} from './configuration-needAssesment-routing.module';

import { SharedModules } from 'src/app/shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';


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