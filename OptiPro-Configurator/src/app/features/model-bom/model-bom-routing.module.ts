import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelBomAddEditComponent } from './model-bom-add-edit/model-bom-add-edit.component';
import { ModelBomViewComponent } from './model-bom-view/model-bom-view.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: ModelBomViewComponent },
  { path: 'add', component: ModelBomAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: ModelBomAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'add/:id', component: ModelBomAddEditComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelBOMRoutingModule { }
