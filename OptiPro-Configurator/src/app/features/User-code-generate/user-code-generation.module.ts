import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCodeGenerationRoutingModule } from './user-code-generation-routing.module';
import { UserCgViewComponent } from './user-cg-view/user-cg-view.component';
import { UserCgAddEditComponent } from './user-cg-add-edit/user-cg-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [UserCgViewComponent, UserCgAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    UserCodeGenerationRoutingModule
  ],
  entryComponents: [UserCgViewComponent]
})
export class UserCodeGenerationModule { }
