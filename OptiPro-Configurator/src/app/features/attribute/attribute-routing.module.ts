import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttributeViewComponent } from './attribute-view/attribute-view.component';
import { AttributeAddEditComponent } from './attribute-add-edit/attribute-add-edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';


const routes: Routes = [ {
  path: '',
  redirectTo: 'view',
  pathMatch: 'full'    
}, 
{ path: 'view', component: AttributeViewComponent },
{ path: 'add', component: AttributeAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
{ path: 'edit/:id', component: AttributeAddEditComponent, canDeactivate: [CanDeactivateGuard]  },
{ path: 'add/:id', component: AttributeAddEditComponent, canDeactivate: [CanDeactivateGuard]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeRoutingModule { }
