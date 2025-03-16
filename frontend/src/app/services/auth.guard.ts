import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    
    if (user) {
      if (user.role === 'staff' || user.role === 'admin') {
        return true; // Tillåt åtkomst till staff-sidan
      } else {
        this.router.navigate(['/booking']); // Skicka vanliga användare till bokningssidan
        return false;
      }
    }

    this.router.navigate(['/login']); // Om ingen är inloggad, skicka till login
    return false;
  }
}