import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewLoanPage } from './new-loan.page';

import { NewLoanPageRoutingModule } from './new-loan-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewLoanPageRoutingModule
  ],
  declarations: [NewLoanPage]
})
export class NewLoanPageModule {}
