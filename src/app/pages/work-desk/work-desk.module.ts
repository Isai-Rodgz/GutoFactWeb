import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkDeskPageRoutingModule } from './work-desk-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkDeskPageRoutingModule
  ],
  declarations: []
})
export class WorkDeskPageModule {}
