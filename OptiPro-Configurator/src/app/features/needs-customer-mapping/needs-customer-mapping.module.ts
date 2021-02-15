import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeedsAssesmentCustomerMappingComponent } from './needs-assesment-customer-mapping/needs-assesment-customer-mapping.component';
import { NeedsCustomerMappingRoutingModule } from './needs-customer-mapping.routing.module';
import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';



@NgModule({
    declarations: [NeedsAssesmentCustomerMappingComponent],
    imports: [
        CommonModule,
        SharedModules,
        SplitterModule,
        NeedsCustomerMappingRoutingModule,
        LayoutModule

    ],
    entryComponents: [NeedsAssesmentCustomerMappingComponent]
})
export class NeedsCustomerMappingModule { }

