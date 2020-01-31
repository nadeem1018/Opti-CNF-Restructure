import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureBomAddEditComponent } from './feature-bom-add-edit/feature-bom-add-edit.component';
import { FeatureBomViewComponent } from './feature-bom-view/feature-bom-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: FeatureBomViewComponent },
  { path: 'add-edit', component: FeatureBomAddEditComponent },
  { path: 'add-edit/:id', component: FeatureBomAddEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureBOMRoutingModule { }
