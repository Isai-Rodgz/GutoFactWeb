import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftHistoryPage } from './shift-history.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftHistoryPageRoutingModule {}
