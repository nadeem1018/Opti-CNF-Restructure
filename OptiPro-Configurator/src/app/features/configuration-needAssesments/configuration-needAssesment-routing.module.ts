import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConfigurationNeedAssesmentComponent} from './configuration-need-assesment/configuration-need-assesment.component';

import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo:'view',
    pathMatch: 'full'    
  }, 
  
  { path: 'view', component: ConfigurationNeedAssesmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationNeedAssesmentRoutingModule { }