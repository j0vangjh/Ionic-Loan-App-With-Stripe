import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = firebase.firestore();
  currentUserEmail: string | null = null;

  constructor() {
    // Observer for auth state changes to update currentUserEmail
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserEmail = user.email;
      } else {
        this.currentUserEmail = null;
      }
    });
  }
  observeAuthState(
    func: firebase.Observer<any, Error> | ((a: firebase.User | null) => any)
  ) {
    return firebase.auth().onAuthStateChanged(func);
  }

  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  // Get role of user based on email in firestore
  async getUserRole(email: string): Promise<string> {
    try {
      const userDoc = await this.firestore.collection('users').doc(email).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData['role'];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error; // Propagate the error for handling in the login component
    }
  }

  getCurrentUserEmail(): string | null {
    return this.currentUserEmail;
  }
}
