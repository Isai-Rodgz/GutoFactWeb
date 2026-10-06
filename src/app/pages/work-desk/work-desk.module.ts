import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkDeskPageRoutingModule } from './work-desk-routing.module';
import { WorkDeskPage } from './work-desk.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecimalPipe,
    WorkDeskPageRoutingModule
  ],
  declarations: [WorkDeskPage]
})
export class WorkDeskPageModule {}
