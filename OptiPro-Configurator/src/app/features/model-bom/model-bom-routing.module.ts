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
  { path: 'add-edit', component: ModelBomAddEditComponent },
  { path: 'add-edit/:id', component: ModelBomAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelBOMRoutingModule { }
