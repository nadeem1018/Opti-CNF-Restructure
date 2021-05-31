import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomCwComponent } from './custom-cw/custom-cw.component';

import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import {  CustomCWRoutingModule } from './cust-cw-route.module';

@NgModule({
    declarations: [CustomCwComponent],
    imports: [
        CommonModule,
        CustomCWRoutingModule,
        SharedModules,
        TreeViewModule
    ],
    entryComponents: [CustomCwComponent]
})
export class CustomCWModule { }
