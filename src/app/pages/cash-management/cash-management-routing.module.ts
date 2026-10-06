import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashManagementPage } from './cash-management.page';

const routes: Routes = [
  {
    path: '',
    component: CashManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashManagementPageRoutingModule {}
