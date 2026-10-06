import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewUserPageRoutingModule } from './new-user-routing.module';

import { NewUserPage } from './new-user.page';
import { SharetModule } from 'src/app/sharet/sharet.module';
import { RouterModule } from '@angular/router';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewUserPageRoutingModule,
    SharetModule,
    RouterModule,
    ReactiveFormsModule,
    RouterLink,
    CustomInputComponent
  ],
  declarations: [NewUserPage]
})
export class NewUserPageModule {}
