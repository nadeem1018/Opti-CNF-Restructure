import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentTemplateViewComponent } from './nat-view/nat-view.component';
import { NeedAssessmentTemplateAddEditComponent } from './nat-add-edit/nat-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { CustomLayoutModule } from 'src/app/@layout/customLayout.module';
import { NeedAssessmentTemplateRoutingModule } from './na-temp-routing.module';


@NgModule({
  declarations: [NeedAssessmentTemplateViewComponent, NeedAssessmentTemplateAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    NeedAssessmentTemplateRoutingModule,
    SplitterModule,
    CustomLayoutModule ,
    LayoutModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
   entryComponents: [NeedAssessmentTemplateViewComponent]
})
export class NeedAssessmentTemplateModule { }
