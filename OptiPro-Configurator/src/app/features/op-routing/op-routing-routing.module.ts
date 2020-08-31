import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpRoutingViewComponent } from './op-routing-view/op-routing-view.component';
import { OpRoutingAddEditComponent } from './op-routing-add-edit/op-routing-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: OpRoutingViewComponent },
  { path: 'add', component: OpRoutingAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'add/:id', component: OpRoutingAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: OpRoutingAddEditComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpRoutingRoutingModule { }
