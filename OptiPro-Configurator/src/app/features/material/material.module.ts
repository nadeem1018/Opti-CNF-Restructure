import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialComponent } from './material.component';

import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { MaterialComponentRoutingModule } from './material.routing.module';

@NgModule({
    declarations: [MaterialComponent],
    imports: [
        CommonModule,
        MaterialComponentRoutingModule,
        SharedModules,
        TreeViewModule
    ],
    entryComponents: [MaterialComponent]
})
export class MaterialComponentModule { }
