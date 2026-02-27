import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators'; 

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

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

  constructor() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide nav if on login page, otherwise show it
      this.showNav = event.url !== '/login' && event.url !== '/';
    });
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
