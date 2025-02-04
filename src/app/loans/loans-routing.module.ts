import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoansPage } from './loans.page';

const routes: Routes = [
  {
    path: '',
    component: LoansPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansPageRoutingModule {}
