import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  platform: any;
  constructor() {
    // Your web app's Firebase configuration

    const firebaseConfig = {
      //Your firebase credentials
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }
}
