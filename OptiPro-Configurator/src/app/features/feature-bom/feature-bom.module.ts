import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureBOMRoutingModule } from './feature-bom-routing.module';
import { FeatureBomViewComponent } from './feature-bom-view/feature-bom-view.component';
import { FeatureBomAddEditComponent } from './feature-bom-add-edit/feature-bom-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@NgModule({
  declarations: [FeatureBomViewComponent, FeatureBomAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    FeatureBOMRoutingModule,
    TreeViewModule
  ],
  entryComponents: [FeatureBomViewComponent]
})
export class FeatureBOMModule { }
