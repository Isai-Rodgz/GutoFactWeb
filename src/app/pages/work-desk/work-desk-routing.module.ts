import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkDeskPage } from './work-desk.page';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WorkDeskPage,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkDeskPageRoutingModule {}
