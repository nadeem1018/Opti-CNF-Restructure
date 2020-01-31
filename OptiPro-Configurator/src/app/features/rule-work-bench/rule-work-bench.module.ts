import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleWorkBenchRoutingModule } from './rule-work-bench-routing.module';
import { RuleWbViewComponent } from './rule-wb-view/rule-wb-view.component';
import { RuleWbAddEditComponent } from './rule-wb-add-edit/rule-wb-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RuleWbViewComponent, RuleWbAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    RuleWorkBenchRoutingModule
  ],
  entryComponents: [RuleWbViewComponent]
})
export class RuleWorkBenchModule { }
