import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelBOMRoutingModule } from './model-bom-routing.module';
import { ModelBomAddEditComponent } from './model-bom-add-edit/model-bom-add-edit.component';
import { ModelBomViewComponent } from './model-bom-view/model-bom-view.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ModelBomAddEditComponent, ModelBomViewComponent],
  imports: [
    CommonModule,
    SharedModules,
    ModelBOMRoutingModule
  ],
  entryComponents: [ModelBomViewComponent]
})
export class ModelBOMModule { }
