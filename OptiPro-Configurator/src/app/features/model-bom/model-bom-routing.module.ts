import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelBomAddEditComponent } from './model-bom-add-edit/model-bom-add-edit.component';
import { ModelBomViewComponent } from './model-bom-view/model-bom-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: ModelBomViewComponent },
  { path: 'add', component: ModelBomAddEditComponent },
  { path: 'edit/:id', component: ModelBomAddEditComponent },
  { path: 'add/:id', component: ModelBomAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelBOMRoutingModule { }
