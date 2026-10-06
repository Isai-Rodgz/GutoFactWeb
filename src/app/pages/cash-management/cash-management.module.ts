import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CashManagementPage } from './cash-management.page';

import { IonicModule } from '@ionic/angular';

import { CashManagementPageRoutingModule } from './cash-management-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashManagementPageRoutingModule
  ],
  declarations: [CashManagementPage]
})
export class CashManagementPageModule {}
