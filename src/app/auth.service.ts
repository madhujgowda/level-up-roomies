import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }
}