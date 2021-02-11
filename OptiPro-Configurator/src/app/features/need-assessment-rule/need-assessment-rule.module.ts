import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentRuleRoutingModule } from './need-assessment-rule-routing.module';
import { NeedAssessmentRuleViewComponent } from './need-assessment-rule-view/need-assessment-rule-view.component';
import { NeedAssessmentRuleAddEditComponent } from './need-assessment-rule-add-edit/need-assessment-rule-add-edit.component';


@NgModule({
  declarations: [NeedAssessmentRuleViewComponent, NeedAssessmentRuleAddEditComponent],
  imports: [
    CommonModule,
    NeedAssessmentRuleRoutingModule
  ]
})
export class NeedAssessmentRuleModule { }
