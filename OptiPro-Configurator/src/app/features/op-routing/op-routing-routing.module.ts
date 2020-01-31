import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpRoutingViewComponent } from './op-routing-view/op-routing-view.component';
import { OpRoutingAddEditComponent } from './op-routing-add-edit/op-routing-add-edit.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: OpRoutingViewComponent },
  { path: 'add-edit', component: OpRoutingAddEditComponent },
  { path: 'add-edit/:id', component: OpRoutingAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpRoutingRoutingModule { }
