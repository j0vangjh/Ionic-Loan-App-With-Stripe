import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  userRole: string;
  constructor(private authService: AuthService) {
    this.authService.observeAuthState((user) => {
      if (user) {
        this.authService.getUserRole(user.email).then((role) => {
          this.userRole = role;
        });
      }
    });
  }
  isUser() {
    return this.userRole === 'user';
  }

  isManager() {
    return this.userRole === 'manager';
  }
}
