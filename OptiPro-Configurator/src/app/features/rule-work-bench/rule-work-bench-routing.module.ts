import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleWbViewComponent } from './rule-wb-view/rule-wb-view.component';
import { RuleWbAddEditComponent } from './rule-wb-add-edit/rule-wb-add-edit.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'    
  }, 
  { path: 'view', component: RuleWbViewComponent },
  { path: 'add-edit', component: RuleWbAddEditComponent },
  { path: 'add-edit/:id', component: RuleWbAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleWorkBenchRoutingModule { }
