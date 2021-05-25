import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationWizardRoutingModule } from './configuration-wizard-routing.module';
import { CwViewComponent } from './cw-view/cw-view.component';

import {FormsModule} from '@angular/forms';
import { CwOperationCustomerComponent } from './cw-operation-customer/cw-operation-customer.component';
import { CwMbomConfigureProductComponent } from './cw-mbom-configure-product/cw-mbom-configure-product.component';
import { CwVerifyAcceptFinalComponent } from './cw-verify-accept-final/cw-verify-accept-final.component';
import { CwViewOldComponent } from './cw-view-old/cw-view.component';
import { SharedModules } from 'src/app/shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CustomerAddressComponent } from './customer-address/customer-address.component';
import { DelarCustomerMapComponent } from './delar-customer-map/delar-customer-map.component';
import {LookupFilterPipe} from './search.pipe';
import {AccesoryLookupFilterPipe} from './search.pipe';


@NgModule({
  declarations: [CwViewComponent, CwOperationCustomerComponent, CwMbomConfigureProductComponent, CwVerifyAcceptFinalComponent, CwViewOldComponent, CustomerAddressComponent, DelarCustomerMapComponent,LookupFilterPipe,AccesoryLookupFilterPipe],
  imports: [
    CommonModule,
    ConfigurationWizardRoutingModule,
    FormsModule,
    LayoutModule,
    SharedModules    
  ],
  // entryComponents: [CwViewComponent]
  entryComponents: [CwViewOldComponent]
})
export class ConfigurationWizardModule { }
