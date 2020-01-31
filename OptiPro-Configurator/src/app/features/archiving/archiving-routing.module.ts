import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchivingViewComponent } from './archiving-view/archiving-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: ArchivingViewComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivingRoutingModule { }
