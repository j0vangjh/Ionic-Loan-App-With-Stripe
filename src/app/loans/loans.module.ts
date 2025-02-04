import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoansPage } from './loans.page';

import { LoansPageRoutingModule } from './loans-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoansPageRoutingModule
  ],
  declarations: [LoansPage]
})
export class LoansPageModule {}
