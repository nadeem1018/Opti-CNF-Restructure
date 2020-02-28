import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureModelAddEditComponent } from './feature-model-add-edit/feature-model-add-edit.component';
import { FeatureModelViewComponent } from './feature-model-view/feature-model-view.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: FeatureModelViewComponent },
  { path: 'add', component: FeatureModelAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: FeatureModelAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'add/:id', component: FeatureModelAddEditComponent, canDeactivate: [CanDeactivateGuard]  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureModelRoutingModule { }
