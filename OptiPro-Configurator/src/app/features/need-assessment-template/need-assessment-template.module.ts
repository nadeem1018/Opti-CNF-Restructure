import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentTemplateRoutingModule } from './need-assessment-template-routing.module';
import { NeedAssessmentTemplateViewComponent } from './need-assessment-template-view/need-assessment-template-view.component';
import { NeedAssessmentTemplateAddEditComponent } from './need-assessment-template-add-edit/need-assessment-template-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { CustomLayoutModule } from 'src/app/@layout/customLayout.module';


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
