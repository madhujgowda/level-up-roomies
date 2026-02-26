import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  errorMsg: string | null = null;

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const userEmail = result.user.email;

      if (userEmail) {
        console.log('Access Granted!');
        // This will redirect to a dashboard once we create it
        this.router.navigate(['/dashboard']); 
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
