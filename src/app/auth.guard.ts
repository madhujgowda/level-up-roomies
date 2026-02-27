import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1), // Check once and move on
    map(user => {
      if (user) {
        return true; // Access granted
      } else {
        // Not logged in? Redirect to login
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
