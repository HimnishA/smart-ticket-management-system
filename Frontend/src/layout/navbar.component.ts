import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="logo">Smart Ticket System</div>

      <div class="links">

        <!-- SUPPORT MANAGER -->
        <a routerLink="/dashboard" *ngIf="isSupportManager()">Dashboard</a>
        <a routerLink="/manager/ticket-queue" *ngIf="isSupportManager()">Tickets</a>
        <a routerLink="/reports" *ngIf="isSupportManager()">Reports</a>

        <!-- SUPPORT AGENT -->
        <a routerLink="/agent-dashboard" *ngIf="isSupportAgent()">My Dashboard</a>
        <a routerLink="/tickets" *ngIf="isSupportAgent()">My Tickets</a>

        <!-- END USER -->
        <a routerLink="/user-dashboard" *ngIf="isEndUser()">My Dashboard</a>
        <a routerLink="/tickets" *ngIf="isEndUser()">My Tickets</a>

        <!-- ADMIN -->
        <a routerLink="/admin-dashboard" *ngIf="isAdmin()">Dashboard</a>
        <a routerLink="/admin/users" *ngIf="isAdmin()">Users</a>
        <a routerLink="/admin/categories" *ngIf="isAdmin()">Categories</a>
        <a routerLink="/admin/priorities" *ngIf="isAdmin()">Priorities</a>
        <a routerLink="/admin/sla-policies" *ngIf="isAdmin()">SLA Policies</a>

        <a *ngIf="!isLoggedIn()" routerLink="/login">Login</a>
        <button *ngIf="isLoggedIn()" class="link-button" (click)="onLogout()">
          Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 64px;
      background: #1e293b;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .links a {
      color: white;
      margin-right: 16px;
      text-decoration: none;
      font-weight: 500;
    }

    .link-button {
      background: none;
      border: none;
      color: white;
      margin-right: 16px;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .link-button:hover {
      text-decoration: underline;
    }
  `]
})
export class NavbarComponent {

  constructor(private auth: AuthService, private router: Router) {}

  // -------------------------
  // ROLE CHECKS
  // -------------------------

  isSupportManager(): boolean {
    return this.auth.roles.includes('SupportManager');
  }

  isSupportAgent(): boolean {
    return this.auth.roles.includes('SupportAgent');
  }

  isEndUser(): boolean {
    return this.auth.roles.includes('EndUser');
  }

  isAdmin(): boolean {
    return this.auth.roles.includes('Admin');
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
