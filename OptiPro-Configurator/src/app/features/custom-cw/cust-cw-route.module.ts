import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomCwComponent} from './custom-cw/custom-cw.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: CustomCwComponent }
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomCWRoutingModule { }
