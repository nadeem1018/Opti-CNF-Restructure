import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedAssessmentTemplateViewComponent } from './need-assessment-template-view/need-assessment-template-view.component';
import { NeedAssessmentTemplateAddEditComponent } from './need-assessment-template-add-edit/need-assessment-template-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: NeedAssessmentTemplateViewComponent },
  { path: 'add', component: NeedAssessmentTemplateAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: NeedAssessmentTemplateAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'add/:id', component: NeedAssessmentTemplateAddEditComponent, canDeactivate: [CanDeactivateGuard]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedAssessmentTemplateRoutingModule { }
