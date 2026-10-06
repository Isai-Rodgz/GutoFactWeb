import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { InventoryManagementPageRoutingModule } from './inventory-management-routing.module';
import { InventoryManagementPage } from './inventory-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryManagementPageRoutingModule,
    DatePipe
  ],
  declarations: [InventoryManagementPage]
})
export class InventoryManagementPageModule {}
