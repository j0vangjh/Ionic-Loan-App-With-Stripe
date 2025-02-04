import { Component } from '@angular/core';
import { Loan } from '../shared/loan';
import { LoanService } from '../shared/loan.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-loans',
  templateUrl: 'loans.page.html',
  styleUrls: ['loans.page.scss'],
})
export class LoansPage {
  loans: Loan[]; // Array to hold all loans
  userLoans: Loan[] = []; // Array to hold loans specific for current user
  currentUserEmail: string | null = null;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) {
    this.loanService.getAllLoans().subscribe((data) => {
      this.loans = data;
      this.currentUserLoans();
    });
    this.authService.observeAuthState((user) => {
      if (user) {
        this.currentUserEmail = user.email;
        this.currentUserLoans();
      } else {
        this.currentUserEmail = null;
      }
    });
  }
  // Filter loans specific to current user
  currentUserLoans() {
    if (this.currentUserEmail) {
      this.userLoans = this.loans.filter(
        (loan) => loan.username === this.currentUserEmail
      );
    }
  }
}
