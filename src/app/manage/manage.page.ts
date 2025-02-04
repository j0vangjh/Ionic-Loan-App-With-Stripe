import { Component } from '@angular/core';
import { Loan } from '../shared/loan';
import { LoanService } from '../shared/loan.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-manage',
  templateUrl: 'manage.page.html',
  styleUrls: ['manage.page.scss'],
})
export class ManagePage {
  loans: Loan[];
  constructor(
    private loanService: LoanService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    // Fetch loans with 'pending' status and assign them to the loans array
    this.loanService.getLoansByStatus('pending').subscribe((data) => {
      this.loans = data;
    });
  }
  async approveLoan(loan: Loan) {
    const loading = await this.loadingController.create({
      message: 'Approving loan...',
    });
    await loading.present();
    this.loanService.updateLoanStatus(loan.id, 'approved').then(async () => {
      loan.status = 'approved';
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Loan ' + loan.id + 'has been approved successfully',
        duration: 2000,
        position: 'top',
        color: 'success',
      });
      toast.present();
    });
  }

  async rejectLoan(loan: Loan) {
    const loading = await this.loadingController.create({
      message: 'Rejecting loan...',
    });
    await loading.present();
    this.loanService.updateLoanStatus(loan.id, 'rejected').then(async () => {
      loan.status = 'rejected';
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Loan ' + loan.id + 'has been rejected successfully',
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    });
  }
}
