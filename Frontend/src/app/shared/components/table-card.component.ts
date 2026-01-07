import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-card-container">
      <table class="table-card">
        <thead>
          <tr>
            <th *ngFor="let key of keys">{{ formatHeader(key) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows">
            <td *ngFor="let key of keys">{{ row[key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-card-container {
      overflow-x: auto;
      margin-top: 12px;
    }

    .table-card {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .table-card thead {
      position: sticky;
      top: 0;
    }

    .table-card th {
      background: #f8fafc;
      font-weight: 600;
      font-size: 14px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }

    .table-card tbody tr {
      transition: background-color 0.15s ease;
    }

    .table-card tbody tr:hover {
      background-color: #f8fafc;
    }

    .table-card tbody tr:last-child td {
      border-bottom: none;
    }

    .table-card td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      font-size: 14px;
    }
  `]
})
export class TableCardComponent {
  @Input() rows: any[] = [];

  get keys(): string[] {
    return this.rows.length ? Object.keys(this.rows[0]) : [];
  }

  formatHeader(key: string): string {
    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
