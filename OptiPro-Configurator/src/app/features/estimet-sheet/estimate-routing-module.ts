import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EstimetSheetComponent} from './estimet-sheet.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: EstimetSheetComponent }
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstimateComponentRoutingModule { }
