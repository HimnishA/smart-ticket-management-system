import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stat-card',
  imports: [CommonModule], // 🔴 REQUIRED for ngClass
  template: `
    <div class="card" [ngClass]="colorClass">
      <div class="title">{{ title }}</div>
      <div class="value">{{ value }}</div>
    </div>
  `,
  styles: [`
    .card {
      flex: 1;
      padding: 16px;
      border-radius: 10px;
      background: #f1f5f9;
      border-left: 6px solid transparent;
    }

    .title {
      font-size: 14px;
      color: #475569;
    }

    .value {
      font-size: 24px;
      font-weight: 600;
    }

    .green { border-left-color: #22c55e; }
    .amber { border-left-color: #f59e0b; }
    .red   { border-left-color: #ef4444; }
  `]
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() colorClass: 'green' | 'amber' | 'red' = 'green';
}
