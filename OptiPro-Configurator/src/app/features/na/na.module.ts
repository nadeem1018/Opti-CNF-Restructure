import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';



import { NeedAssessmentAddEditComponent } from './na-add-edit/na-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { CustomLayoutModule } from 'src/app/@layout/customLayout.module';
import { NeedAssessmentViewComponent } from './na-view/na-view.component';
import { NeedAssessmentRoutingModule } from './na-routing.module';


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
