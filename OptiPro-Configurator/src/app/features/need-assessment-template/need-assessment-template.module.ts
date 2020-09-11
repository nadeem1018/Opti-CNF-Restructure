import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAssessmentTemplateRoutingModule } from './need-assessment-template-routing.module';
import { NeedAssessmentTemplateViewComponent } from './need-assessment-template-view/need-assessment-template-view.component';
import { NeedAssessmentTemplateAddEditComponent } from './need-assessment-template-add-edit/need-assessment-template-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';



@NgModule({
  declarations: [NeedAssessmentTemplateViewComponent, NeedAssessmentTemplateAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    NeedAssessmentTemplateRoutingModule,
    TreeViewModule
  ],
  entryComponents: [NeedAssessmentTemplateViewComponent]
})
export class NeedAssessmentTemplateModule { }
