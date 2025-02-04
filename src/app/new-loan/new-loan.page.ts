import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Item } from '../shared/item';
import { ItemService } from '../shared/item.service';
import { Loan } from '../shared/loan';
import { LoanService } from '../shared/loan.service';

@Component({
  selector: 'app-new-loan',
  templateUrl: 'new-loan.page.html',
  styleUrls: ['new-loan.page.scss'],
})
export class NewLoanPage {
  items: Item[];
  loan: Loan;

  constructor(
    private itemService: ItemService,
    private loanService: LoanService,
    private toastController: ToastController
  ) {
    // Fetch all items and assign them to the items array
    this.itemService.getAllAsync().subscribe((result) => (this.items = result));
  }
  get isSubmitDisabled(): boolean {
    // Disable the submit button if there are no items or if none of the items have a quantity greater than 0
    return !this.items || !this.items.some((item) => item.quantity > 0);
  }
  async submit() {
    // for (let temp of this.items) {
    //   console.log(temp.id + ': ' + temp.quantity);
    // }
    this.loanService.createLoan(this.items).then(async (loan) => {
      const toast = await this.toastController.create({
        message: 'Loan created with ID ' + loan.id,
        duration: 2000,
        position: 'top',
        color: 'secondary',
      });
      toast.present();

      // After loan created successfully, reset all item quantity to 0
      this.itemService.resetQuantity();
    });
  }
}
