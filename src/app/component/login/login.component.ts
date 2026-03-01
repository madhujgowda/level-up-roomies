import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';

import { Auth, GoogleAuthProvider, user, User, signInWithPopup, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  user$: Observable<User | null>;

  errorMsg: string | null = null;

  constructor(private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const userEmail = result.user.email;

      if (userEmail) {
      const userRef = doc(this.firestore, 'allowedUsers', userEmail);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        console.log('Access Granted!');
        this.router.navigate(['/dashboard']); 
      } else {
        // Email is not in the whitelist, sign them out immediately
        await signOut(this.auth);
        alert('Access denied: Unauthorized email.');
        this.router.navigate(['/login']); 
      }
    } else {
      await signOut(this.auth);
      this.errorMsg = "Access Denied: You are not a registered roommate.";
    }
    } catch (error) {
      console.error(error);
      this.errorMsg = "Login failed. Check your internet or Firebase console.";
    }
  }
}
