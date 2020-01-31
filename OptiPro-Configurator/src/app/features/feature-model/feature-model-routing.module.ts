import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureModelAddEditComponent } from './feature-model-add-edit/feature-model-add-edit.component';
import { FeatureModelViewComponent } from './feature-model-view/feature-model-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: FeatureModelViewComponent },
  { path: 'add', component: FeatureModelAddEditComponent },
  { path: 'edit/:id', component: FeatureModelAddEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureModelRoutingModule { }
