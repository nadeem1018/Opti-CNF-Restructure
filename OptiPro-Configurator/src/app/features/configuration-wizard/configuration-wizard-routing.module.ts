import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CwViewComponent } from './cw-view/cw-view.component';
import { CwViewOldComponent } from './cw-view-old/cw-view.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  // { path: 'view', component: CwViewComponent },
  { path: 'view', component: CwViewOldComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationWizardRoutingModule { }
