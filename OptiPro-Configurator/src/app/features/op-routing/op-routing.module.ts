import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpRoutingRoutingModule } from './op-routing-routing.module';
import { OpRoutingViewComponent } from './op-routing-view/op-routing-view.component';
import { OpRoutingAddEditComponent } from './op-routing-add-edit/op-routing-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { MaskedTextBoxModule } from '@progress/kendo-angular-inputs';


@NgModule({
  declarations: [OpRoutingViewComponent, OpRoutingAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    MaskedTextBoxModule,
    OpRoutingRoutingModule
  ],
  entryComponents: [OpRoutingViewComponent, OpRoutingAddEditComponent]
})
export class OpRoutingModule { }
