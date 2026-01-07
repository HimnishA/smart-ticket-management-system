import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  standalone: true,
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-container">
      <!-- HEADER -->
      <div class="page-header">
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">Manage ticket categories for the system</p>
      </div>

      <!-- ADD CATEGORY CARD -->
      <div class="add-category-card">
        <div class="card-header">
          <h3 class="card-title">Add New Category</h3>
        </div>
        <form (ngSubmit)="onSubmit()" class="category-form">
          <div class="form-group">
            <label for="name">Category Name *</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="newCategory.name"
              name="name"
              class="form-input"
              placeholder="e.g., Technical Support"
              required>
          </div>
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              [(ngModel)]="newCategory.description"
              name="description"
              class="form-textarea"
              placeholder="Describe this category..."
              rows="3"
              required></textarea>
          </div>
          <button type="submit" class="submit-button" [disabled]="loading || !newCategory.name.trim() || !newCategory.description.trim()">
            <span *ngIf="!loading">➕ Add Category</span>
            <span *ngIf="loading">Adding...</span>
          </button>
        </form>
      </div>

      <!-- CATEGORIES LIST -->
      <div class="categories-list-card">
        <div class="card-header">
          <h3 class="card-title">All Categories ({{ categories.length }})</h3>
        </div>

        <!-- LOADING STATE -->
        <div class="loading-state" *ngIf="loading && categories.length === 0">
          <div class="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>

        <!-- CATEGORIES TABLE -->
        <div class="table-wrapper" *ngIf="!loading || categories.length > 0">
          <table class="data-table" *ngIf="categories.length > 0; else emptyState">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of categories">
                <td class="id-cell">#{{ category.id }}</td>
                <td class="name-cell">{{ category.name }}</td>
                <td>
                  <span class="status-badge" [class]="category.isActive ? 'active' : 'inactive'">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button
                      *ngIf="!category.isActive"
                      (click)="activateCategory(category.id)"
                      class="action-button activate-button"
                      [disabled]="loading">
                      Activate
                    </button>
                    <button
                      *ngIf="category.isActive"
                      (click)="deactivateCategory(category.id)"
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
              <div class="empty-icon">📁</div>
              <p class="empty-text">No categories found. Create your first category above!</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
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

    .add-category-card,
    .categories-list-card {
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

    .category-form {
      display: flex;
      flex-direction: column;
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

    .form-input,
    .form-textarea {
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
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
      text-align: center;
      vertical-align: middle;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      justify-content: center;
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

      .add-category-card,
      .categories-list-card {
        padding: 16px;
      }

      .data-table th,
      .data-table td {
        padding: 12px;
      }
    }
  `]
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  loading: boolean = false;

  newCategory = {
    name: '',
    description: ''
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.adminService.getCategories().subscribe({
      next: (res) => {
        this.categories = res ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.newCategory.name.trim() || !this.newCategory.description.trim()) {
      return;
    }

    this.loading = true;
    this.adminService.createCategory({
      name: this.newCategory.name.trim(),
      description: this.newCategory.description.trim()
    }).subscribe({
      next: () => {
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to create category', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  activateCategory(id: number): void {
    if (!confirm('Are you sure you want to activate this category?')) {
      return;
    }

    this.loading = true;
    this.adminService.activateCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to activate category', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deactivateCategory(id: number): void {
    if (!confirm('Are you sure you want to deactivate this category?')) {
      return;
    }

    this.loading = true;
    this.adminService.deactivateCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to deactivate category', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

