import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelarCustomerMappingComponent } from './delar-customer-mapping/delar-customer-mapping.component';
import {DelarCustomerMappingRoutingModule} from './delar-customer-mapping.routing.module';
import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@NgModule({
    declarations: [DelarCustomerMappingComponent],
    imports: [
        CommonModule,
        DelarCustomerMappingRoutingModule,
        SharedModules,
        TreeViewModule
    ],
    entryComponents: [DelarCustomerMappingComponent]
})
export class DelarCustomerMappingModule { }
