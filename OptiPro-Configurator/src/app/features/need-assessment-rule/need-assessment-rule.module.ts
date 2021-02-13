import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentRuleRoutingModule } from './need-assessment-rule-routing.module';
import { NeedAssessmentRuleViewComponent } from './need-assessment-rule-view/need-assessment-rule-view.component';
import { NeedAssessmentRuleAddEditComponent } from './need-assessment-rule-add-edit/need-assessment-rule-add-edit.component';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { CustomLayoutModule } from 'src/app/@layout/customLayout.module';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [NeedAssessmentRuleViewComponent, NeedAssessmentRuleAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    NeedAssessmentRuleRoutingModule,
    SplitterModule,
    CustomLayoutModule ,
    LayoutModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NeedAssessmentRuleViewComponent]
})
export class NeedAssessmentRuleModule { }
