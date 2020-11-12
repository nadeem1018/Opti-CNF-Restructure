import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeRoutingModule } from './attribute-routing.module';
import { AttributeViewComponent } from './attribute-view/attribute-view.component';
import { AttributeAddEditComponent } from './attribute-add-edit/attribute-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AttributeViewComponent, AttributeAddEditComponent],
  imports: [
    CommonModule,   
    SharedModules,
    AttributeRoutingModule
  ],
  entryComponents: [AttributeViewComponent]
})
export class AttributeModule { }
