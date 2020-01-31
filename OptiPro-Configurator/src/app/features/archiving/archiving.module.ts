import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivingRoutingModule } from './archiving-routing.module';
import { ArchivingViewComponent } from './archiving-view/archiving-view.component';
import { SharedModules } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ArchivingViewComponent],
  imports: [
    CommonModule,
    SharedModules,
    ArchivingRoutingModule
  ],
  entryComponents: [ArchivingViewComponent]
})
export class ArchivingModule { }
