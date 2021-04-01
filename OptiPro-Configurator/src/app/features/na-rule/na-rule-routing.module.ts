import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedAssessmentRuleViewComponent } from './nar-view/nar-view.component';
import { NeedAssessmentRuleAddEditComponent } from './nar-add-edit/nar-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: NeedAssessmentRuleViewComponent },
  { path: 'add', component: NeedAssessmentRuleAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: NeedAssessmentRuleAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'add/:id', component: NeedAssessmentRuleAddEditComponent, canDeactivate: [CanDeactivateGuard]  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedAssessmentRuleRoutingModule { }
