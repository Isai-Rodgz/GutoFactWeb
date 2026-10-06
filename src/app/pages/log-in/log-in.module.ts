import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogInPageRoutingModule } from './log-in-routing.module';

import { LogInPage } from './log-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogInPageRoutingModule,
    RouterLink,
    CustomInputComponent,
    ReactiveFormsModule
    
  ],
  declarations: [LogInPage]
})
export class LogInPageModule {}