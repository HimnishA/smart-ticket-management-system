import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../core/services/ticket.service';
import { TicketMasterDataService } from '../../core/services/ticket-master-data.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  standalone: true,
  selector: 'app-new-ticket-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Ticket</h2>

    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" #ticketForm="ngForm">
        <div class="form-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title *</mat-label>
            <input
              matInput
              [(ngModel)]="ticketData.title"
              name="title"
              required
              placeholder="Enter ticket title"
              maxlength="200">
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description *</mat-label>
            <textarea
              matInput
              [(ngModel)]="ticketData.description"
              name="description"
              required
              placeholder="Describe your issue or request"
              rows="5"
              maxlength="2000">
            </textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Category *</mat-label>
            <mat-select
              [(ngModel)]="ticketData.categoryId"
              name="categoryId"
              required>
              <mat-option *ngFor="let cat of categories" [value]="cat.id">
                {{ cat.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority *</mat-label>
            <mat-select
              [(ngModel)]="ticketData.priorityId"
              name="priorityId"
              required>
              <mat-option *ngFor="let priority of priorities" [value]="priority.id">
                {{ priority.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()" [disabled]="loading">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="loading || !ticketData.title?.trim() || !ticketData.description?.trim() || !ticketData.categoryId || !ticketData.priorityId">
        <span *ngIf="!loading">Create Ticket</span>
        <span *ngIf="loading">Creating...</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
      max-width: 600px;
      padding: 20px 24px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      color: #dc2626;
      font-size: 14px;
      margin-top: 8px;
      padding: 8px;
      background: #fef2f2;
      border-radius: 4px;
      border: 1px solid #fecaca;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: auto;
        padding: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NewTicketDialogComponent implements OnInit {
  ticketData = {
    title: '',
    description: '',
    categoryId: null as number | null,
    priorityId: null as number | null
  };

  categories: any[] = [];
  priorities: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<NewTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ticketService: TicketService,
    private ticketmasterdataService: TicketMasterDataService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPriorities();
  }

  loadCategories(): void {
    this.ticketmasterdataService.getCategories().subscribe({
      next: (res) => {
        // Filter only active categories (isActive === true)
        // API response: [{ id: number, name: string, isActive: boolean }]
        this.categories = (res ?? []).filter((cat: any) => cat.isActive === true);
        // Sort by name for better UX
        this.categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  loadPriorities(): void {
    this.ticketmasterdataService.getPriorities().subscribe({
      next: (res) => {
        // Filter only active priorities (isActive === true)
        // API response: [{ id: number, name: string, isActive: boolean }]
        this.priorities = (res ?? []).filter((p: any) => p.isActive === true);
        // Sort by id to maintain priority order (Low=1, Medium=2, High=3)
        this.priorities.sort((a: any, b: any) => a.id - b.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load priorities', err);
        this.errorMessage = 'Failed to load priorities. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }


  cancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (!this.ticketData.title?.trim() || !this.ticketData.description?.trim() || !this.ticketData.categoryId || !this.ticketData.priorityId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.ticketService.createTicket({
        title: this.ticketData.title.trim(),
        description: this.ticketData.description.trim(),
        categoryId: this.ticketData.categoryId,
        priorityId: this.ticketData.priorityId
      }).subscribe({
        next: (res) => {
          this.loading = false;
          this.dialogRef.close(true); // Return true to indicate success
        },
        error: (err) => {
          this.loading = false;
          const apiError = err?.error;
          if (typeof apiError === 'string') {
            this.errorMessage = apiError;
          } else if (apiError?.error) {
            this.errorMessage = apiError.error;
          } else if (apiError?.message) {
            this.errorMessage = apiError.message;
          } else {
            this.errorMessage = 'Failed to create ticket. Please try again.';
          }
          this.cdr.detectChanges();
        }
    });
  }

  

}

