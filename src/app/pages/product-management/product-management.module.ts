import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductManagementPageRoutingModule } from './product-management-routing.module';
import { ProductManagementPage } from './product-management.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductManagementPageRoutingModule,
    DecimalPipe
  ],
  declarations: [ProductManagementPage]
})
export class ProductManagementPageModule {}
