import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
// import { TrnaslateLazyModule } from './module/translate-lazy.module';

@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    // TrnaslateLazyModule,
    FlexLayoutModule,
    DialogsModule,
    GridModule,
    ExcelModule,
    FormsModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class SharedModules { }
