import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstimetSheetComponent } from './estimet-sheet.component';

import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { EstimateComponentRoutingModule } from './estimate-routing-module';

@NgModule({
    declarations: [EstimetSheetComponent],
    imports: [
        CommonModule,
        EstimateComponentRoutingModule,
        SharedModules,
        TreeViewModule
    ],
    entryComponents: [EstimetSheetComponent]
})
export class EstimateToolComponentModule { }
