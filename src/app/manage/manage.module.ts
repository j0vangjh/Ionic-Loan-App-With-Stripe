import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagePage } from './manage.page';

import { ManagePageRoutingModule } from './manage-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ManagePage }]),
    ManagePageRoutingModule,
  ],
  declarations: [ManagePage]
})
export class ManagePageModule {}
