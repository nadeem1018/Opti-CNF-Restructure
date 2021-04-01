import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NeedsAssesmentCustomerMappingComponent} from './na-customer-mapping/na-customer-mapping.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: NeedsAssesmentCustomerMappingComponent },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedsCustomerMappingRoutingModule { }
