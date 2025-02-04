import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Validation for login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  // Async function to return a promise first so we check if form is valid first before attempting to log in
  async login() {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        // Await to pause login until AuthService resolves the promise
        const userCredential = await this.authService.login(email, password);
        const user = userCredential.user;

        if (user) {
          // Get user role based on email
          const role = await this.authService.getUserRole(user.email);

          // TODO: Based on user role go to different page
          if (role === 'user') {
            this.router.navigate(['/tabs/new-loan']);
          } else if (role === 'manager') {
            this.router.navigate(['/tabs/manage']);
          } else {
            console.error('Unknown user role:', role);
            // Handle unexpected role
          }
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
        // Handle login error
      }
    } else {
      this.errorMessage = 'Please enter a valid email and password.'; // Handle invalid form
    }
  }
}
