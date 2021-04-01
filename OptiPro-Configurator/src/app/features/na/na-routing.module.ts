import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedAssessmentAddEditComponent } from './na-add-edit/na-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';
import { NeedAssessmentViewComponent } from './na-view/na-view.component';


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
