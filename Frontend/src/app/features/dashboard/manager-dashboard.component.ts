import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingService } from '../../core/services/reporting.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BarChartComponent } from '../../shared/components/bar-chart.component';

@Component({
  standalone: true,
  selector: 'app-manager-dashboard',
  imports: [
    CommonModule,
    StatCardComponent,
    BarChartComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- HEADER -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Support Manager Dashboard</h1>
        <p class="dashboard-subtitle">Monitor performance metrics and agent workload</p>
      </div>

      <!-- KPI SECTION -->
      <section class="kpi-section">
        <app-stat-card
          title="SLA Compliance"
          [value]="slaValue"
          [colorClass]="getSlaColor()">
        </app-stat-card>

        <app-stat-card
          title="Avg Resolution Time"
          [value]="avgResolutionValue"
          [colorClass]="getResolutionColor()">
        </app-stat-card>
      </section>

      <!-- CONTENT GRID -->
      <div class="content-grid">
        <!-- CHART SECTION -->
        <section class="chart-section" *ngIf="statusLabels.length; else noChartData">
          <div class="section-header">
            <h3 class="section-title">Tickets by Status</h3>
            <p class="section-description">Distribution of tickets across different statuses</p>
          </div>
          <div class="chart-wrapper">
            <app-bar-chart
              chartId="ticketsByStatusChart"
              [labels]="statusLabels"
              [data]="statusCounts"
              title="Tickets by Status">
            </app-bar-chart>
          </div>
        </section>

        <ng-template #noChartData>
          <section class="chart-section">
            <div class="section-header">
              <h3 class="section-title">Tickets by Status</h3>
              <p class="section-description">Distribution of tickets across different statuses</p>
            </div>
            <div class="empty-state">
              <p class="empty-state-text">No ticket data available</p>
            </div>
          </section>
        </ng-template>

        <!-- AGENT WORKLOAD -->
        <section class="table-section">
          <div class="section-header">
            <h3 class="section-title">Agent Workload</h3>
            <p class="section-description">Current active ticket assignments per agent</p>
          </div>

          <div class="table-wrapper" *ngIf="formattedAgentWorkload.length; else noWorkload">
            <table class="workload-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Active Tickets</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let agent of formattedAgentWorkload">
                  <td class="agent-name">
                    <span class="agent-icon">👤</span>
                    {{ agent.agentName }}
                  </td>
                  <td class="ticket-count">
                    <span class="badge" [class]="getWorkloadBadgeClass(agent.activeTickets)">
                      {{ agent.activeTickets }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #noWorkload>
            <div class="empty-state">
              <div class="empty-state-icon">📊</div>
              <p class="empty-state-text">No active agent workload available</p>
              <p class="empty-state-subtext">Agent assignments will appear here once tickets are assigned</p>
            </div>
          </ng-template>
        </section>
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .chart-section,
    .table-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
    }

    .chart-section:hover,
    .table-section:hover {
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

    .table-wrapper {
      overflow-x: auto;
      margin-top: 8px;
    }

    .workload-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 8px;
    }

    .workload-table thead {
      position: sticky;
      top: 0;
    }

    .workload-table th {
      background: #f8fafc;
      font-weight: 600;
      font-size: 14px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px 16px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }

    .workload-table th:first-child {
      border-top-left-radius: 8px;
    }

    .workload-table th:last-child {
      border-top-right-radius: 8px;
    }

    .workload-table tbody tr {
      transition: background-color 0.15s ease;
    }

    .workload-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .workload-table tbody tr:last-child td {
      border-bottom: none;
    }

    .workload-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      font-size: 14px;
    }

    .agent-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .agent-icon {
      font-size: 18px;
    }

    .ticket-count {
      text-align: right;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 13px;
      min-width: 40px;
      text-align: center;
    }

    .badge.low {
      background-color: #dcfce7;
      color: #166534;
    }

    .badge.medium {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge.high {
      background-color: #fee2e2;
      color: #991b1b;
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

      .chart-section,
      .table-section {
        padding: 16px;
      }

      .section-title {
        font-size: 18px;
      }
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {

  /* ================= KPI VALUES ================= */
  slaValue = 'Loading...';
  avgResolutionValue = 'Loading...';

  /* ================= CHART DATA ================= */
  statusLabels: string[] = [];
  statusCounts: number[] = [];

  /* ================= AGENT WORKLOAD ================= */
  formattedAgentWorkload: {
    agentName: string;
    activeTickets: number;
  }[] = [];

  constructor(
    private reporting: ReportingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    /* SLA Compliance */
    this.reporting.getSlaCompliance().subscribe(res => {
      this.slaValue = `${res?.compliancePercentage ?? 0}%`;
      this.cdr.detectChanges();
    });

    /* Average Resolution Time */
    this.reporting.getAverageResolutionTime().subscribe(res => {
      this.avgResolutionValue = `${res?.averageResolutionHours ?? 0} hrs`;
      this.cdr.detectChanges();
    });

    /* Tickets by Status (Chart) */
    this.reporting.getTicketsByStatus().subscribe(res => {
      this.statusLabels = res.map(x => x.label);
      this.statusCounts = res.map(x => x.count);
      this.cdr.detectChanges();
    });

    /* Agent Workload */
    this.reporting.getAgentWorkload().subscribe(res => {
      this.formattedAgentWorkload = (res ?? []).map((x: any) => ({
        agentName: x.agentName,
        activeTickets: x.activeTicketCount
      }));
      this.cdr.detectChanges();
    });
  }

  /* ================= KPI COLOR LOGIC ================= */

  getSlaColor(): 'green' | 'amber' | 'red' {
    const value = Number(this.slaValue.replace('%', ''));
    if (value >= 95) return 'green';
    if (value >= 80) return 'amber';
    return 'red';
  }

  getResolutionColor(): 'green' | 'amber' | 'red' {
    const hours = Number(this.avgResolutionValue.replace(' hrs', ''));
    if (hours <= 4) return 'green';
    if (hours <= 8) return 'amber';
    return 'red';
  }

  getWorkloadBadgeClass(ticketCount: number): 'low' | 'medium' | 'high' {
    if (ticketCount <= 5) return 'low';
    if (ticketCount <= 15) return 'medium';
    return 'high';
  }
}
