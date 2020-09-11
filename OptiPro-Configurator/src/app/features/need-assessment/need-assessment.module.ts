import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentRoutingModule } from './need-assessment-routing.module';
import { NeedAssessmentAddEditComponent } from './need-assessment-add-edit/need-assessment-add-edit.component';
import { NeedAssessmentViewComponent } from './need-assessment-view/need-assessment-view.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [NeedAssessmentViewComponent,NeedAssessmentAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    NeedAssessmentRoutingModule
  ],
  entryComponents: [NeedAssessmentViewComponent]
})
export class NeedAssessmentModule { }
