import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureModelRoutingModule } from './feature-model-routing.module';
import { FeatureModelViewComponent } from './feature-model-view/feature-model-view.component';
import { FeatureModelAddEditComponent } from './feature-model-add-edit/feature-model-add-edit.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FeatureModelViewComponent, FeatureModelAddEditComponent],
  imports: [
    CommonModule,
    SharedModules,
    FeatureModelRoutingModule
  ],
  entryComponents: [FeatureModelViewComponent]
})
export class FeatureModelModule { }
