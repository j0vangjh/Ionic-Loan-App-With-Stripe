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
      apiKey: 'AIzaSyCT5dQAubM_xSXM6m6LGsRzk4H3pLo5p_k',
      authDomain: 'msa2024s2.firebaseapp.com',
      projectId: 'msa2024s2',
      storageBucket: 'msa2024s2.firebasestorage.app',
      messagingSenderId: '403609825981',
      appId: '1:403609825981:web:48e1aa9db415de4934fdd4',
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }
}
