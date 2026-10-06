import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductManagementPage } from './product-management.page';

const routes: Routes = [
  {
    path: '',
    component: ProductManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductManagementPageRoutingModule {}
