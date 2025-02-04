import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'new-loan',
        loadChildren: () =>
          import('../new-loan/new-loan.module').then(
            (m) => m.NewLoanPageModule
          ),
      },
      {
        path: 'loans',
        loadChildren: () =>
          import('../loans/loans.module').then((m) => m.LoansPageModule),
      },
      {
        path: 'manage',
        loadChildren: () =>
          import('../manage/manage.module').then((m) => m.ManagePageModule),
      },
      {
        path: 'transaction-history',
        loadChildren: () =>
          import('../transaction-history/transaction-history.module').then(
            (m) => m.TransactionHistoryPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
