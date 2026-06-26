import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators'; 
import { environment } from '../environments/environment';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';


import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private auth = inject(Auth);
  private router = inject(Router);

  protected readonly title = signal('level-up-roomies');

  showNav = false;
  isHandSet = false;

  // true when viewport is handset sized; used to switch sidenav mode
  isHandset$!: import('rxjs').Observable<boolean>;

  user$: Observable<User | null>;

  private subscriptions = new Subscription();

  constructor(public authService: AuthService,
              private breakpoint: BreakpointObserver) {
    // assign after breakpoint has been injected
    this.isHandset$ = this.breakpoint.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
    this.user$ = this.authService.user$;
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide nav if on login page, otherwise show it
      this.showNav = event.url !== '/login' && event.url !== '/';
    });
  }

  ngOnInit() {
    const app = initializeApp(environment.firebaseConfig);
    const messaging = getMessaging(app);

    this.requestNotificationPermission(messaging);

    onMessage(messaging, (payload) => {
      console.log('Foreground message received: ', payload);
      alert(`New Message: ${payload.notification?.title}\n${payload.notification?.body}`);
    });

    this.subscriptions.add(
      this.isHandset$.subscribe(matches => {
        this.isHandSet = matches;
      })
    );

    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.showNav = event.url !== '/login' && event.url !== '/';
      })
    );
  }

  requestNotificationPermission(messaging: any) {    
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // Note: You can find or generate your VAPID key in Project Settings -> Cloud Messaging
        getToken(messaging, { vapidKey: environment.vapidKey })
          .then((currentToken) => {
            if (currentToken) {
              console.log('🚀 YOUR REGISTRATION TOKEN:');
              console.log(currentToken); 
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      } else {
        console.warn('Unable to get permission to notify.');
      }
    });
  }

  drawerToggle(drawer: MatSidenav) {
    if (this.isHandSet) {
      if (drawer) {
        drawer.toggle();
      }
    }
  }

   async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
