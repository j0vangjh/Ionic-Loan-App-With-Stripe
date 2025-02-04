import { Injectable } from '@angular/core';
import { Item } from './item';
import { Loan } from './loan';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(private authService: AuthService) {}

  createLoan(items: Item[]) {
    // Due date is 2 weeks after today
    let duedate = new Date(); // Today
    duedate.setHours(0, 0, 0, 0); // Midnight
    duedate.setDate(duedate.getDate() + 14); // 2 weeks later

    // TODO: Get username logged in
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      throw new Error('No user is currently logged in.');
    }
    let loan = new Loan(currentUserEmail, 'pending', duedate);

    // Add to collection '/loans/<autoID>'
    return firebase
      .firestore()
      .collection('loans')
      .add({
        username: loan.username,
        status: loan.status,
        duedate: loan.duedate,
      })
      .then((doc) => {
        loan.id = doc.id;
        // Add to collection '/loans/<autoID>/items/'
        for (let item of items) {
          if (item.quantity > 0) {
            // Add a new document '/loans/<autoID>/items/<itemID>'
            firebase
              .firestore()
              .collection('loans/' + doc.id + '/items/')
              .doc(item.id)
              .set({
                quantity: item.quantity,
              });
          }
        }
        return loan;
      });
  }

  getAllLoans(): Observable<any> {
    return new Observable((observer) => {
      // Read collection '/loans'
      firebase
        .firestore()
        .collection('loans')
        .orderBy('duedate')
        .onSnapshot((collection) => {
          let array = [];
          collection.forEach((doc) => {
            // Add loan into array if there's no error
            try {
              let loan = new Loan(
                doc.data()['username'],
                doc.data()['status'],
                doc.data()['duedate'].toDate(),
                doc.id
              );
              array.push(loan);

              // Read subcollection '/loans/<autoID>/items'
              let dbItems = firebase
                .firestore()
                .collection('loans/' + doc.id + '/items');
              dbItems.onSnapshot((itemsCollection) => {
                loan.items = []; // Empty array
                itemsCollection.forEach((itemDoc) => {
                  let item = new Item(itemDoc.id, itemDoc.data()['quantity']);
                  loan.items.push(item);
                });
              });
            } catch (error) {}
          });
          observer.next(array);
        });
    });
  }

  getLoanById(id: string) {
    // Read document '/loans/<id>'
    return firebase
      .firestore()
      .collection('loans')
      .doc(id)
      .get()
      .then((doc) => {
        let loan = new Loan(
          doc.data()['username'],
          doc.data()['status'],
          doc.data()['duedate'].toDate(),
          doc.id
        );

        // Read subcollection '/loans/<id>/items'
        return firebase
          .firestore()
          .collection('loans/' + id + '/items')
          .get()
          .then((collection) => {
            loan.items = []; // Empty array
            collection.forEach((doc) => {
              let item = new Item(doc.id, doc.data()['quantity']);
              loan.items.push(item);
            });
            return loan;
          });
      });
  }

  updateLoanStatus(id: string, status: string) {
    return firebase
      .firestore()
      .collection('loans')
      .doc(id)
      .update({ status: status });
  }

  deleteLoan(id: string) {
    const itemsCollection = firebase
      .firestore()
      .collection('loans')
      .doc(id)
      .collection('items');
    return itemsCollection.get().then((querySnapshot) => {
      const batch = firebase.firestore().batch();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit().then(() => {
        return firebase.firestore().collection('loans').doc(id).delete();
      });
    });
  }

  getLoansByStatus(status: string): Observable<any> {
    return new Observable((observer) => {
      // Read collection '/loans'
      firebase
        .firestore()
        .collection('loans')
        .where('status', '==', status)
        .orderBy('duedate')
        .onSnapshot((collection) => {
          let array = [];
          collection.forEach((doc) => {
            // Add loan into array if there's no error
            try {
              let loan = new Loan(
                doc.data()['username'],
                doc.data()['status'],
                doc.data()['duedate'].toDate(),
                doc.id
              );
              array.push(loan);

              // Read subcollection '/loans/<autoID>/items'
              let dbItems = firebase
                .firestore()
                .collection('loans/' + doc.id + '/items');
              dbItems.onSnapshot((itemsCollection) => {
                loan.items = []; // Empty array
                itemsCollection.forEach((itemDoc) => {
                  let item = new Item(itemDoc.id, itemDoc.data()['quantity']);
                  loan.items.push(item);
                });
              });
            } catch (error) {}
          });
          observer.next(array);
        });
    });
  }

  getUserTransactions(): Observable<any[]> {
    // Get the transactions for the currently logged in user
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      throw new Error('No user is currently logged in.');
    }

    return new Observable((observer) => {
      firebase
        .firestore()
        .collection('transactions')
        .where('userEmail', '==', currentUserEmail)
        .orderBy('timestamp', 'desc')
        .onSnapshot(
          (snapshot) => {
            const transactions = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data()['timestamp']?.toDate(),
              paid: doc.data()['paid'] || false,
            }));
            console.log('Fetched transactions:', transactions);
            observer.next(transactions);
          },
          (error) => {
            console.error('Error fetching transactions:', error);
            observer.error(error);
          }
        );
    });
  }

  async payFine(
    loanId: string,
    fineAmount: number,
    paymentId: string
  ): Promise<string> {
    try {
      console.log('payFine called with:', { loanId, fineAmount, paymentId });

      // Record the fine payment in the Firestore database
      const currentUserEmail = this.authService.getCurrentUserEmail();
      if (!currentUserEmail) {
        throw new Error('No user is currently logged in.');
      }

      const transactionRef = await firebase
        .firestore()
        .collection('transactions')
        .add({
          loanId,
          userEmail: currentUserEmail,
          amount: fineAmount,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          description: 'Loan fine payment',
          paid: true, // Mark the transaction as paid
          paymentId, // Include the payment ID from Stripe
        });

      console.log('Transaction recorded with ID:', transactionRef.id);

      // Update the loan document to mark it as paid
      await firebase.firestore().collection('loans').doc(loanId).update({
        paid: true,
      });

      // Return a confirmation message or transaction ID
      return `Fine payment recorded with ID: ${transactionRef.id}`;
    } catch (error) {
      console.error('Error processing fine payment:', error);
      throw error;
    }
  }
}
