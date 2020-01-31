import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemCgAddEditComponent } from './item-cg-add-edit/item-cg-add-edit.component';
import { ItemCgViewComponent } from './item-cg-view/item-cg-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: ItemCgViewComponent },
  { path: 'add', component: ItemCgAddEditComponent },
  { path: 'edit/:id', component: ItemCgAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemCodeGenerationRoutingModule { }
