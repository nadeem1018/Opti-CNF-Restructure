import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CwViewComponent } from './cw-view/cw-view.component';
import { CwViewOldComponent } from './cw-view-old/cw-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  // { path: 'view', component: CwViewComponent },
  { path: 'view', component: CwViewOldComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationWizardRoutingModule { }
