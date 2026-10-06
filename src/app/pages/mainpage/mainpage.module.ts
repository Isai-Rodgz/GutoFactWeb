import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainpagePageRoutingModule } from './mainpage-routing.module';

import { MainpagePage } from './mainpage.page';
import { SharetModule } from 'src/app/sharet/sharet.module';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainpagePageRoutingModule,
    SharetModule,
    RouterModule,
    RouterLink
  ],
  declarations: [MainpagePage]
})
export class MainpagePageModule {}
