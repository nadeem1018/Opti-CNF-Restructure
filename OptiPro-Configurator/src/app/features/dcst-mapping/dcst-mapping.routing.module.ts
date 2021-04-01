import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DelarCustomerMappingComponent} from './delar-customer-mapping/delar-customer-mapping.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: DelarCustomerMappingComponent }
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelarCustomerMappingRoutingModule { }
