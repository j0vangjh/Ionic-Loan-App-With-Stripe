import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoanService } from '../shared/loan.service';
import { ToastController } from '@ionic/angular';
import 'firebase/firestore';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {
  loanId: string;
  paymentId: string;

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.loanId = params['loanId'];
      const sessionId = params['session_id'];
      if (sessionId) {
        this.fetchPaymentId(sessionId);
      }
      console.log('Session ID: ' + sessionId);
      console.log('Loan ID:', this.loanId);
    });
  }

  async fetchPaymentId(sessionId: string) {
    try {
      console.log('Fetching payment details for sessionId:', sessionId);

      const session = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer //Your secret key `,
          },
        }
      ).then((res) => res.json());

      console.log('Session Details:', session);

      if (session.payment_intent) {
        const paymentIntent = await fetch(
          `https://api.stripe.com/v1/payment_intents/${session.payment_intent}`,
          {
            headers: {
              Authorization: `Bearer //Your secret key `,
            },
          }
        ).then((res) => res.json());

        console.log('Payment Intent Details:', paymentIntent);

        this.paymentId = paymentIntent.id;

        // Call the payFine method to record the transaction in Firestore
        await this.loanService.payFine(
          this.loanId, // Pass the loanId
          session.amount_total / 100,
          this.paymentId // Pass the paymentId (Stripe payment intent ID)
        );

        // Show a success message
        const toast = await this.toastController.create({
          message: 'Payment recorded successfully!',
          duration: 2000,
          position: 'top',
          color: 'success',
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error fetching payment ID:', error);
      const toast = await this.toastController.create({
        message: 'Failed to fetch payment ID: ' + error,
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
      this.paymentId = 'Error fetching payment ID';
    }
  }

  navigateToLoans() {
    this.router.navigate(['/tabs/loans']);
  }
}
