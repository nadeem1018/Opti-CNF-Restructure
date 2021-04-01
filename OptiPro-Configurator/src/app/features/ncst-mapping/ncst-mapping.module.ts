import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeedsAssesmentCustomerMappingComponent } from './na-customer-mapping/na-customer-mapping.component';

import { SharedModules } from 'src/app/shared/shared.module';
import { SplitterModule, LayoutModule } from '@progress/kendo-angular-layout';
import { NeedsCustomerMappingRoutingModule } from './ncst-mapping.routing.module';



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

