import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainpagePage } from './mainpage.page';

const routes: Routes = [
  {
    path: '',
    component: MainpagePage
  },
  {
    path: 'new-user',
    loadChildren: () => import('../new-user/new-user.module').then( m => m.NewUserPageModule)
  },
  {
    path: 'reset-pass',
    loadChildren: () => import('../reset-pass/reset-pass.module').then( m => m.ResetPassPageModule)
  },
  {
    path: 'log-in',
    loadChildren: () => import('../log-in/log-in.module').then( m => m.LogInPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainpagePageRoutingModule {}
