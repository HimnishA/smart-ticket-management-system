import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <!-- HEADER -->
      <div class="page-header">
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">Approve or reject pending user registration requests</p>
      </div>

      <!-- PENDING USERS LIST -->
      <div class="users-list-card">
        <div class="card-header">
          <h3 class="card-title">Users ({{ pendingUsers.length }})</h3>
        </div>

        <!-- LOADING STATE -->
        <div class="loading-state" *ngIf="loading && pendingUsers.length === 0">
          <div class="loading-spinner"></div>
          <p>Loading pending users...</p>
        </div>

        <!-- USERS TABLE -->
        <div class="table-wrapper" *ngIf="!loading || pendingUsers.length > 0">
          <table class="data-table" *ngIf="pendingUsers.length > 0; else emptyState">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of pendingUsers">
                <td class="id-cell">#{{ user.userId }}</td>
                <td class="email-cell">{{ user.email }}</td>
                <td class="name-cell">{{ user.fullName || 'N/A' }}</td>
                <td>
                  <div class="role-selection" *ngIf="!user.isApproved">
                    <select 
                      [(ngModel)]="user.selectedRoleId" 
                      class="role-select"
                      [disabled]="loading">
                      <option [value]="null">Select Role</option>
                      <option [value]="2">Support Manager</option>
                      <option [value]="3">Support Agent</option>
                      <option [value]="4">End User</option>
                    </select>
                  </div>
                  <span *ngIf="user.isApproved" class="empty-role">—</span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons" *ngIf="!user.isApproved">
                    <button
                      (click)="approveUser(user)"
                      class="action-button approve-button"
                      [disabled]="loading || !user.selectedRoleId">
                      ✓ Approve
                    </button>
                    <button
                      (click)="rejectUser(user)"
                      class="action-button reject-button"
                      [disabled]="loading">
                      ✗ Reject
                    </button>
                  </div>
                  <span *ngIf="user.isApproved" class="status-badge approved">
                    Approved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <ng-template #emptyState>
            <div class="empty-state">
              <div class="empty-icon">👥</div>
              <h3 class="empty-state-title">No Pending Users</h3>
              <p class="empty-state-text">There are no pending user registration requests at this time.</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 400;
    }

    .users-list-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .data-table thead {
      position: sticky;
      top: 0;
    }

    .data-table th {
      background: #f8fafc;
      font-weight: 600;
      font-size: 13px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px 16px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }

    .data-table tbody tr {
      transition: background-color 0.15s ease;
    }

    .data-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .data-table tbody tr:last-child td {
      border-bottom: none;
    }

    .data-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      font-size: 14px;
    }

    .id-cell {
      font-weight: 600;
      color: #64748b;
      font-family: 'Courier New', monospace;
    }

    .email-cell {
      font-weight: 500;
      color: #3b82f6;
    }

    .name-cell {
      font-weight: 500;
    }

    .role-selection {
      min-width: 180px;
    }

    .role-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      background: white;
      color: #1e293b;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .role-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .role-select:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.approved {
      background-color: #dcfce7;
      color: #166534;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .actions-cell {
      text-align: right;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .action-button {
      padding: 6px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .approve-button {
      background: #dcfce7;
      color: #166534;
    }

    .approve-button:hover:not(:disabled) {
      background: #bbf7d0;
    }

    .reject-button {
      background: #fee2e2;
      color: #991b1b;
    }

    .reject-button:hover:not(:disabled) {
      background: #fecaca;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-role {
      font-size: 14px;
      color: #94a3b8;
      font-style: italic;
    }

    .status-badge.approved {
      background-color: #dcfce7;
      color: #166534;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .empty-state-text {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 24px;
      }

      .users-list-card {
        padding: 16px;
      }

      .data-table th,
      .data-table td {
        padding: 12px;
      }

      .action-buttons {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {

  pendingUsers: any[] = [];
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.loading = true;
    this.adminService.getPendingUsers().subscribe({
      next: (res) => {
        // Initialize selectedRoleId for each user (only for non-approved users)
        this.pendingUsers = (res ?? []).map((user: any) => ({
          ...user,
          selectedRoleId: null
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load pending users', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approveUser(user: any): void {
    if (!user.selectedRoleId) {
      alert('Please select a role before approving the user.');
      return;
    }

    if (!confirm(`Are you sure you want to approve ${user.email} with the selected role?`)) {
      return;
    }

    this.loading = true;
    this.adminService.approveUser(user.userId, [user.selectedRoleId]).subscribe({
      next: () => {
        // Mark user as approved and refresh the list
        user.isApproved = true;
        this.loadPendingUsers();
      },
      error: (err) => {
        console.error('Failed to approve user', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejectUser(user: any): void {
    if (!confirm(`Are you sure you want to reject ${user.email}? This action cannot be undone.`)) {
      return;
    }

    this.loading = true;
    this.adminService.rejectUser(user.userId).subscribe({
      next: () => {
        this.loading = false;
        // Refresh the list to remove rejected user
        this.loadPendingUsers();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to reject user', err);
        alert('Failed to reject user. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}

