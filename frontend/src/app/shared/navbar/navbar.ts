import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);
  router = inject(Router);

  getUserName(): string {
    const user = this.authService.getUser();
    return user ? user.name : 'User';
  }

  getUserRole(): string {
    const user = this.authService.getUser();
    return user ? user.role : '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
