import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan } from '../shared/loan';
import { LoanService } from '../shared/loan.service';
import { loadStripe } from '@stripe/stripe-js';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  loan: Loan;
  stripePromise = loadStripe(
    'pk_test_51MR7fsFGpAWUri8AtitqngNL1NIRRpVRp5dgnt8bZaLnpccGoNsD8Gw2LTltfdq6J0RTUPGtClSCkyaicl3hz0gJ00XuLrgywm'
  );
  cardElement: any;
  isPaid: boolean = false;

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const loanId = params.get('id');
      if (loanId) {
        // Fetch the loan initially
        this.loanService.getLoanById(loanId).then((loan) => {
          this.loan = loan;

          // Fetch transactions for the current loan
          this.loanService.getUserTransactions().subscribe((transactions) => {
            const paymentForLoan = transactions.find(
              (transaction) => transaction.loanId === loanId && transaction.paid
            );
            this.isPaid = !!paymentForLoan; // Set isPaid based on whether a paid transaction exists
          });
        });
      }
    });
  }
  cancelLoan() {
    if (this.loan && this.loan.id) {
      this.loanService.deleteLoan(this.loan.id).then(() => {
        this.router.navigate(['/tabs/loans']);
      });
    }
  }

  async fine() {
    const loading = await this.loadingController.create({
      message: 'Processing payment...',
    });
    await loading.present();

    try {
      const fineAmount = 1000;
      const loanId = this.loan?.id;

      if (!loanId) {
        throw new Error('Loan ID is missing.');
      }

      // Get the current user's email
      const currentUserEmail = this.authService.getCurrentUserEmail();

      // Call backend to create the Stripe Checkout session
      const response = await fetch(
        'http://localhost:4242/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: fineAmount,
            description: 'Loan Fine Payment',
            loanId: loanId,
            userEmail: currentUserEmail, // Pass the user's email to the backend
            userUid: 'JhLJLVXmSARopAQD1GAyYLB1mD42',
          }),
        }
      );
      console.log('Response:', response);
      const session = await response.json();

      if (session.url) {
        // Redirect the user to the Stripe Checkout page
        window.location.href = session.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } finally {
      await loading.dismiss();
    }
  }

  isDueDatePassed(): boolean {
    if (!this.loan || !this.loan.duedate) {
      return false;
    }
    const dueDate = new Date(this.loan.duedate);
    const currentDate = new Date();
    return dueDate < currentDate;
  }
}
