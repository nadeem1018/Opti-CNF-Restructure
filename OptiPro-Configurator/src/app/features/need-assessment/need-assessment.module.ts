import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentRoutingModule } from './need-assessment-routing.module';
import { NeedAssessmentViewComponent } from './need-assessment-view/need-assessment-view.component';
import { NeedAssessmentAddEditComponent } from './need-assessment-add-edit/need-assessment-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { CustomLayoutModule } from 'src/app/@layout/customLayout.module';


@NgModule({
  declarations: [NeedAssessmentViewComponent, NeedAssessmentAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    NeedAssessmentRoutingModule,
    SplitterModule,
    CustomLayoutModule ,
    LayoutModule
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NeedAssessmentViewComponent]
})
export class NeedAssessmentModule { }
