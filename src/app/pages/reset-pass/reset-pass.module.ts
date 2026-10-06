import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';

import { IonicModule } from '@ionic/angular';

import { ResetPassPageRoutingModule } from './reset-pass-routing.module';

import { ResetPassPage } from './reset-pass.page';
import { SharetModule } from 'src/app/sharet/sharet.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPassPageRoutingModule,
    SharetModule,
    RouterLink,
    CustomInputComponent,
    ReactiveFormsModule
  ],
  declarations: [ResetPassPage]
})
export class ResetPassPageModule {}
