import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingService } from '../../core/services/reporting.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BarChartComponent } from '../../shared/components/bar-chart.component';

@Component({
  standalone: true,
  selector: 'app-agent-dashboard',
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
        <p class="dashboard-subtitle">Track your ticket assignments and performance metrics</p>
      </div>

      <!-- KPI SECTION -->
      <section class="kpi-section">
        <app-stat-card
          title="My Active Tickets"
          [value]="'' + myActiveTickets"
          colorClass="amber">
        </app-stat-card>

        <app-stat-card
          title="My Total Tickets"
          [value]="'' + myTotalTickets"
          colorClass="green">
        </app-stat-card>
      </section>

      <!-- CHARTS GRID -->
      <div class="charts-grid">
        <!-- STATUS: BAR CHART -->
        <section class="chart-section" *ngIf="statusLabels.length; else noStatusData">
          <div class="section-header">
            <h3 class="section-title">My Tickets by Status</h3>
            <p class="section-description">Distribution of your tickets across different statuses</p>
          </div>
          <div class="chart-wrapper">
            <app-bar-chart
              chartId="agentStatusChart"
              [labels]="statusLabels"
              [data]="statusCounts"
              title="Tickets by Status">
            </app-bar-chart>
          </div>
        </section>

        <ng-template #noStatusData>
          <section class="chart-section">
            <div class="section-header">
              <h3 class="section-title">My Tickets by Status</h3>
              <p class="section-description">Distribution of your tickets across different statuses</p>
            </div>
            <div class="empty-state">
              <p class="empty-state-text">No status data available</p>
            </div>
          </section>
        </ng-template>

        <!-- PRIORITY: PIE CHART -->
        <section class="chart-section" *ngIf="priorityLabels.length; else noPriorityData">
          <div class="section-header">
            <h3 class="section-title">My Tickets by Priority</h3>
            <p class="section-description">Breakdown of your tickets by priority level</p>
          </div>
          <div class="chart-wrapper">
            <app-bar-chart
              chartId="agentPriorityChart"
              [labels]="priorityLabels"
              [data]="priorityCounts"
              chartType="pie"
              title="Tickets by Priority">
            </app-bar-chart>
          </div>
        </section>

        <ng-template #noPriorityData>
          <section class="chart-section">
            <div class="section-header">
              <h3 class="section-title">My Tickets by Priority</h3>
              <p class="section-description">Breakdown of your tickets by priority level</p>
            </div>
            <div class="empty-state">
              <p class="empty-state-text">No priority data available</p>
            </div>
          </section>
        </ng-template>
      </div>
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

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 24px;
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

    .empty-state-text {
      font-size: 16px;
      font-weight: 500;
      color: #64748b;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

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
export class AgentDashboardComponent implements OnInit {

  myActiveTickets = 0;
  myTotalTickets = 0;

  // Status chart
  statusLabels: string[] = [];
  statusCounts: number[] = [];

  // Priority chart
  priorityLabels: string[] = [];
  priorityCounts: number[] = [];

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.reportingService.getAgentDashboard().subscribe(res => {
      this.myActiveTickets = res.myActiveTickets;
      this.myTotalTickets = res.myTotalTickets;

      this.statusLabels = res.ticketsByStatus.map((x: any) => x.status);
      this.statusCounts = res.ticketsByStatus.map((x: any) => x.count);

      this.priorityLabels = res.ticketsByPriority.map((x: any) => x.priority);
      this.priorityCounts = res.ticketsByPriority.map((x: any) => x.count);

      this.cdr.detectChanges();
    });
  }
}
