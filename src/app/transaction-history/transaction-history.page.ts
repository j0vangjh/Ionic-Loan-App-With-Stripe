import { Component, OnInit } from '@angular/core';
import { LoanService } from '../shared/loan.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {
  transactions = [];

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loanService.getUserTransactions().subscribe(
      (data) => {
        console.log('Fetched transactions:', data);
        this.transactions = data;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
}
