import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyC7sQdkesqEQvl3e2KY8khUe2eDPF-xNGU",
  authDomain: "level-up-roomies.firebaseapp.com",
  projectId: "level-up-roomies",
  storageBucket: "level-up-roomies.firebasestorage.app",
  messagingSenderId: "655924300985",
  appId: "1:655924300985:web:790bd8af923e19e290df68"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
