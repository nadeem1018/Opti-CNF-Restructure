import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MenuModule } from '@progress/kendo-angular-menu';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { BlankhandlerPipe } from '../core/pipe/blankhandler.pipe';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MenuModule,
    DialogsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BlankhandlerPipe
  ]
})
export class CustomLayoutModule { }
