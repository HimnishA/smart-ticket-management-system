import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  standalone: true,
  selector: 'app-sla-policies',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sla-policies-container">
      <!-- HEADER -->
      <div class="page-header">
        <h1 class="page-title">SLA Policies</h1>
        <p class="page-subtitle">Manage service level agreement policies for ticket resolution</p>
      </div>

      <!-- ADD SLA POLICY CARD -->
      <div class="add-sla-card">
        <div class="card-header">
          <h3 class="card-title">Add New SLA Policy</h3>
        </div>
        <form (ngSubmit)="onSubmit()" class="sla-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">SLA Policy Name *</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="newSla.name"
                name="name"
                class="form-input"
                placeholder="e.g., Standard SLA"
                required>
            </div>
            <div class="form-group">
              <label for="resolutionHours">Resolution Hours *</label>
              <input
                type="number"
                id="resolutionHours"
                [(ngModel)]="newSla.resolutionHours"
                name="resolutionHours"
                class="form-input"
                placeholder="e.g., 24"
                min="1"
                required>
              <small class="form-hint">Number of hours for ticket resolution</small>
            </div>
          </div>
          <button type="submit" class="submit-button" [disabled]="loading || !newSla.name.trim() || !newSla.resolutionHours">
            <span *ngIf="!loading">➕ Add SLA Policy</span>
            <span *ngIf="loading">Adding...</span>
          </button>
        </form>
      </div>

      <!-- SLA POLICIES LIST -->
      <div class="sla-policies-list-card">
        <div class="card-header">
          <h3 class="card-title">All SLA Policies ({{ slas.length }})</h3>
        </div>

        <!-- LOADING STATE -->
        <div class="loading-state" *ngIf="loading && slas.length === 0">
          <div class="loading-spinner"></div>
          <p>Loading SLA policies...</p>
        </div>

        <!-- SLA POLICIES TABLE -->
        <div class="table-wrapper" *ngIf="!loading || slas.length > 0">
          <table class="data-table" *ngIf="slas.length > 0; else emptyState">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Resolution Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sla of slas">
                <td class="id-cell">#{{ sla.id }}</td>
                <td class="name-cell">{{ sla.name }}</td>
                <td>
                  <span class="hours-badge">
                    {{ sla.resolutionHours }} {{ sla.resolutionHours === 1 ? 'hour' : 'hours' }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="sla.isActive ? 'active' : 'inactive'">
                    {{ sla.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button
                      *ngIf="!sla.isActive"
                      (click)="activateSla(sla.id)"
                      class="action-button activate-button"
                      [disabled]="loading">
                      Activate
                    </button>
                    <button
                      *ngIf="sla.isActive"
                      (click)="deactivateSla(sla.id)"
                      class="action-button deactivate-button"
                      [disabled]="loading">
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <ng-template #emptyState>
            <div class="empty-state">
              <div class="empty-icon">⏱️</div>
              <p class="empty-text">No SLA policies found. Create your first SLA policy above!</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sla-policies-container {
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

    .add-sla-card,
    .sla-policies-list-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
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

    .sla-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
    }

    .form-input {
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-hint {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .submit-button {
      align-self: flex-start;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .submit-button:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      opacity: 0.6;
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

    .name-cell {
      font-weight: 500;
    }

    .hours-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
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

    .activate-button {
      background: #dcfce7;
      color: #166534;
    }

    .activate-button:hover:not(:disabled) {
      background: #bbf7d0;
    }

    .deactivate-button {
      background: #fee2e2;
      color: #991b1b;
    }

    .deactivate-button:hover:not(:disabled) {
      background: #fecaca;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .add-sla-card,
      .sla-policies-list-card {
        padding: 16px;
      }

      .data-table th,
      .data-table td {
        padding: 12px;
      }
    }
  `]
})
export class SlaPoliciesComponent implements OnInit {

  slas: any[] = [];
  loading: boolean = false;

  newSla = {
    name: '',
    resolutionHours: null as number | null
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSlas();
  }

  loadSlas(): void {
    this.loading = true;
    this.adminService.getSlas().subscribe({
      next: (res) => {
        this.slas = res ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load SLA policies', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.newSla.name.trim() || !this.newSla.resolutionHours) {
      return;
    }

    this.loading = true;
    this.adminService.createSla({
      name: this.newSla.name.trim(),
      resolutionHours: this.newSla.resolutionHours
    }).subscribe({
      next: () => {
        this.newSla = { name: '', resolutionHours: null };
        this.loadSlas();
      },
      error: (err) => {
        console.error('Failed to create SLA policy', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  activateSla(id: number): void {
    if (!confirm('Are you sure you want to activate this SLA policy?')) {
      return;
    }

    this.loading = true;
    this.adminService.activateSla(id).subscribe({
      next: () => {
        this.loadSlas();
      },
      error: (err) => {
        console.error('Failed to activate SLA policy', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deactivateSla(id: number): void {
    if (!confirm('Are you sure you want to deactivate this SLA policy?')) {
      return;
    }

    this.loading = true;
    this.adminService.deactivateSla(id).subscribe({
      next: () => {
        this.loadSlas();
      },
      error: (err) => {
        console.error('Failed to deactivate SLA policy', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

