import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemCgAddEditComponent } from './item-cg-add-edit/item-cg-add-edit.component';
import { ItemCgViewComponent } from './item-cg-view/item-cg-view.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: ItemCgViewComponent },
  { path: 'add', component: ItemCgAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: ItemCgAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'add/:id', component: ItemCgAddEditComponent,   canDeactivate: [CanDeactivateGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemCodeGenerationRoutingModule { }
