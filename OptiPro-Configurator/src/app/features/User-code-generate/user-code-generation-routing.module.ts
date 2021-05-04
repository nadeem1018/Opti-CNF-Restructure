import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCgViewComponent } from './user-cg-view/user-cg-view.component';
import { UserCgAddEditComponent } from './user-cg-add-edit/user-cg-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: UserCgViewComponent },
  { path: 'add', component: UserCgAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
  { path: 'edit/:id', component: UserCgAddEditComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'add/:id', component: UserCgAddEditComponent,   canDeactivate: [CanDeactivateGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCodeGenerationRoutingModule { }
