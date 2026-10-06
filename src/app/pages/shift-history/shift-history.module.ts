import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftHistoryPageRoutingModule } from './shift-history-routing.module';

import { ShiftHistoryPage } from './shift-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftHistoryPageRoutingModule
  ],
  declarations: [ShiftHistoryPage]
})
export class ShiftHistoryPageModule {}
