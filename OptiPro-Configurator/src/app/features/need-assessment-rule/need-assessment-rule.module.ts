import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentRuleRoutingModule } from './need-assessment-rule-routing.module';
import { NeedAssessmentRuleViewComponent } from './nar-view/nar-view.component';
import { NeedAssessmentRuleAddEditComponent } from './nar-add-edit/nar-add-edit.component';
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
