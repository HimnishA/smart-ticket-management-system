import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from '../../core/services/ticket.service';
import { NewTicketDialogComponent } from '../../shared/components/new-ticket-dialog.component';

@Component({
  standalone: true,
  selector: 'app-my-tickets',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-tickets-container">
      <!-- HEADER -->
      <div class="tickets-header">
        <div class="header-content">
          <div>
            <h1 class="tickets-title">My Tickets</h1>
            <p class="tickets-subtitle">View and manage your ticket requests</p>
          </div>
          <button class="create-ticket-btn" (click)="openNewTicketDialog()">
            <span class="btn-icon">➕</span>
            Create New Ticket
          </button>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading your tickets...</p>
      </div>

      <!-- TICKETS LIST -->
      <div class="tickets-list-container" *ngIf="!loading">
        <!-- TICKETS TABLE CARD -->
        <div class="tickets-table-card" *ngIf="tickets.length; else emptyState">
          <div class="table-header">
            <h3 class="table-title">Your Tickets ({{ tickets.length }})</h3>
          </div>

          <div class="table-wrapper">
            <table class="tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created On</th>
                </tr>
              </thead>

              <tbody>
                <tr 
                  *ngFor="let ticket of tickets" 
                  class="clickable-row"
                  (click)="openTicketDetails(ticket)">
                  <td class="ticket-id-cell">#{{ ticket.id || ticket.ticketId }}</td>
                  <td class="title-cell">
                    <div class="ticket-title">{{ ticket.title }}</div>
                  </td>
                  <td>
                    <span class="category-badge">{{ ticket.category }}</span>
                  </td>
                  <td>
                    <span class="priority-badge" [class]="getPriorityClass(ticket.priority)">
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" [class]="getStatusClass(ticket.status)">
                      {{ ticket.status }}
                    </span>
                  </td>
                  <td class="date-cell">{{ ticket.createdAt | date:'medium' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <ng-template #emptyState>
          <div class="empty-state-card">
            <div class="empty-state">
              <div class="empty-state-icon">🎫</div>
              <h3 class="empty-state-title">No Tickets Found</h3>
              <p class="empty-state-text">You don't have any tickets yet.</p>
              <p class="empty-state-subtext">Create a new ticket to get started!</p>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .my-tickets-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .tickets-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
    }

    .create-ticket-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(to right, #2563eb, #1d4ed8);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      white-space: nowrap;
    }

    .create-ticket-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
    }

    .create-ticket-btn:active {
      transform: translateY(0);
    }

    .btn-icon {
      font-size: 18px;
    }

    .tickets-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .tickets-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 400;
    }

    // Loading State
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

      p {
        margin-top: 16px;
        color: #64748b;
        font-size: 14px;
      }
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    // Tickets List Container
    .tickets-list-container {
      margin-top: 0;
    }

    .tickets-table-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .table-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .tickets-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #ffffff;
    }

    .tickets-table thead {
      position: sticky;
      top: 0;
    }

    .tickets-table th {
      background: #f8fafc;
      font-weight: 600;
      font-size: 13px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 20px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }

    .tickets-table tbody tr {
      transition: background-color 0.15s ease;
    }

    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background-color: #f8fafc;
    }

    .tickets-table tbody tr:last-child td {
      border-bottom: none;
    }

    .tickets-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      font-size: 14px;
    }

    // Cell Styling
    .ticket-id-cell {
      font-weight: 600;
      color: #64748b;
      font-family: 'Courier New', monospace;
    }

    .title-cell {
      max-width: 400px;
    }

    .ticket-title {
      font-weight: 500;
      color: #1e293b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date-cell {
      color: #64748b;
      font-size: 13px;
    }

    // Badges
    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background-color: #e0f2fe;
      color: #0369a1;
    }

    .priority-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;

      &.low {
        background-color: #dcfce7;
        color: #166534;
      }

      &.medium {
        background-color: #fef3c7;
        color: #92400e;
      }

      &.high {
        background-color: #fee2e2;
        color: #991b1b;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;

      &.created {
        background-color: #f3f4f6;
        color: #475569;
      }

      &.assigned {
        background-color: #dbeafe;
        color: #1e40af;
      }

      &.inprogress {
        background-color: #fef3c7;
        color: #92400e;
      }

      &.resolved {
        background-color: #dcfce7;
        color: #166534;
      }

      &.closed {
        background-color: #e5e7eb;
        color: #374151;
      }
    }

    // Empty State
    .empty-state-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .empty-state-icon {
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
      font-size: 16px;
      color: #64748b;
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .empty-state-subtext {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }

    // Responsive Design
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .create-ticket-btn {
        width: 100%;
        justify-content: center;
      }

      .tickets-title {
        font-size: 24px;
      }

      .tickets-table-card {
        overflow-x: auto;
      }

      .table-header {
        padding: 16px;
      }

      .tickets-table th,
      .tickets-table td {
        padding: 12px 16px;
      }

      .title-cell {
        max-width: 200px;
      }
    }
  `]
})
export class MyTicketsComponent implements OnInit {

  tickets: any[] = [];
  loading: boolean = true;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  private loadTickets(): void {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (res) => {
        this.tickets = res ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load tickets', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openTicketDetails(ticket: any): void {
    const ticketId = ticket.id || ticket.ticketId;
    if (ticketId) {
      // Navigate to ticket details - route may need to be configured based on user role
      this.router.navigate(['/tickets', ticketId]);
    }
  }

  openNewTicketDialog(): void {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        setTimeout(() => {
          this.loadTickets();
        });
      }
    });
  }

  getPriorityClass(priority: string): string {
    const priorityLower = priority?.toLowerCase() || '';
    if (priorityLower.includes('low')) return 'low';
    if (priorityLower.includes('medium')) return 'medium';
    if (priorityLower.includes('high')) return 'high';
    return 'low';
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('created')) return 'created';
    if (statusLower.includes('assigned')) return 'assigned';
    if (statusLower.includes('progress')) return 'inprogress';
    if (statusLower.includes('resolved')) return 'resolved';
    if (statusLower.includes('closed')) return 'closed';
    return 'created';
  }
}
