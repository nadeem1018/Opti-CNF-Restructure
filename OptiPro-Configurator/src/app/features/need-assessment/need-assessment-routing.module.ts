import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedAssessmentViewComponent } from './need-assessment-view/need-assessment-view.component';
import { NeedAssessmentAddEditComponent } from './need-assessment-add-edit/need-assessment-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: NeedAssessmentViewComponent },
  { path: 'add', component: NeedAssessmentAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: NeedAssessmentAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'add/:id', component: NeedAssessmentAddEditComponent, canDeactivate: [CanDeactivateGuard]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedAssessmentRoutingModule { }
