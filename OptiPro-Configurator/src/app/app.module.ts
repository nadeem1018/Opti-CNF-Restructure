import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';


import { HomeComponent } from './features/home.component';
import { SharedModules } from './shared/shared.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CustomLayoutModule } from './@layout/customLayout.module';
import { LayoutModule, SplitterModule } from '@progress/kendo-angular-layout';







@NgModule({
  declarations: [
    AppComponent,
    HomeComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModules,
    DateInputsModule,
    TooltipModule,
    InputsModule,
    TreeViewModule,
    CustomLayoutModule,
    LayoutModule,
    SplitterModule

  ], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
