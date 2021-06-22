import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MaterialComponent} from './material.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: MaterialComponent }
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialComponentRoutingModule { }
