import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingService } from '../../core/services/reporting.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BarChartComponent } from '../../shared/components/bar-chart.component';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    StatCardComponent,
    BarChartComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- HEADER -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">My Dashboard</h1>
        <p class="dashboard-subtitle">View your ticket status and track your requests</p>
      </div>

      <!-- KPI SECTION -->
      <section class="kpi-section">
        <app-stat-card
          title="My Open Tickets"
          [value]="'' + myOpenTickets"
          colorClass="amber">
        </app-stat-card>

        <app-stat-card
          title="My Total Tickets"
          [value]="'' + myTotalTickets"
          colorClass="green">
        </app-stat-card>
      </section>

      <!-- STATUS CHART -->
      <section class="chart-section" *ngIf="statusLabels.length; else noChartData">
        <div class="section-header">
          <h3 class="section-title">My Tickets by Status</h3>
          <p class="section-description">Overview of your tickets across different statuses</p>
        </div>
        <div class="chart-wrapper">
          <app-bar-chart
            [labels]="statusLabels"
            [data]="statusCounts"
            title="Tickets by Status">
          </app-bar-chart>
        </div>
      </section>

      <ng-template #noChartData>
        <section class="chart-section">
          <div class="section-header">
            <h3 class="section-title">My Tickets by Status</h3>
            <p class="section-description">Overview of your tickets across different statuses</p>
          </div>
          <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <p class="empty-state-text">No ticket data available</p>
            <p class="empty-state-subtext">Your ticket statistics will appear here once you create tickets</p>
          </div>
        </section>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .dashboard-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 400;
    }

    .kpi-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
    }

    .chart-section:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .section-description {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .chart-wrapper {
      margin-top: 8px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state-text {
      font-size: 16px;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 8px 0;
    }

    .empty-state-subtext {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 24px;
      }

      .kpi-section {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .chart-section {
        padding: 16px;
      }

      .section-title {
        font-size: 18px;
      }
    }
  `]
})
export class UserDashboardComponent implements OnInit {

  myOpenTickets = 0;
  myTotalTickets = 0;

  statusLabels: string[] = [];
  statusCounts: number[] = [];

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.reportingService.getUserDashboard().subscribe(res => {
      this.myOpenTickets = res.myOpenTickets;
      this.myTotalTickets = res.myTotalTickets;

      this.statusLabels = res.ticketsByStatus.map((x: any) => x.label);
      this.statusCounts = res.ticketsByStatus.map((x: any) => x.count);

      this.cdr.detectChanges();
    });
  }
}
