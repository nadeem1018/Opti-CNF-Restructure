import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelarCustomerMappingComponent } from './delar-customer-mapping/delar-customer-mapping.component';

import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DelarCustomerMappingRoutingModule } from './dcst-mapping.routing.module';

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
