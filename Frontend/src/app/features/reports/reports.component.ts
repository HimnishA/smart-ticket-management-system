import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingService } from '../../core/services/reporting.service';
import { TableCardComponent } from '../../shared/components/table-card.component';
import { BarChartComponent } from '../../shared/components/bar-chart.component';

@Component({
  standalone: true,
  selector: 'app-reports',
  imports: [
    CommonModule,
    TableCardComponent,
    BarChartComponent
  ],
  template: `
    <div class="reports-container">
      <!-- HEADER -->
      <div class="reports-header">
        <h1 class="reports-title">Reports</h1>
        <p class="reports-subtitle">Comprehensive analytics and insights for your support operations</p>
      </div>

      <!-- SLA COMPLIANCE REPORT -->
      <section class="report-section" *ngIf="slaComplianceRows.length; else noSlaData">
        <div class="section-header">
          <h3 class="section-title">SLA Compliance Report</h3>
          <p class="section-description">Service level agreement compliance metrics and statistics</p>
        </div>
        <div class="table-wrapper">
          <table class="sla-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of slaComplianceRows">
                <td class="metric-name">{{ row.metric }}</td>
                <td class="metric-value" [class.highlight]="row.metric.includes('Compliance')">
                  {{ row.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <ng-template #noSlaData>
        <section class="report-section">
          <div class="section-header">
            <h3 class="section-title">SLA Compliance Report</h3>
            <p class="section-description">Service level agreement compliance metrics and statistics</p>
          </div>
          <div class="empty-state">
            <p class="empty-state-text">No SLA compliance data available</p>
          </div>
        </section>
      </ng-template>

      <!-- REPORTS GRID -->
      <div class="reports-grid">
        <!-- TICKETS BY STATUS -->
        <section class="report-section">
          <div class="section-header">
            <h3 class="section-title">Tickets by Status</h3>
            <p class="section-description">Distribution of tickets across different statuses</p>
          </div>
          
          <div class="chart-wrapper" *ngIf="statusLabels.length; else noStatusChart">
            <app-bar-chart
              chartId="statusReportChart"
              [labels]="statusLabels"
              [data]="statusCounts"
              title="Tickets by Status">
            </app-bar-chart>
          </div>

          <ng-template #noStatusChart>
            <div class="empty-state-small">
              <p class="empty-state-text">No chart data available</p>
            </div>
          </ng-template>

          <div class="table-card-wrapper" *ngIf="ticketsByStatus.length; else noStatusTable">
            <app-table-card [rows]="ticketsByStatus"></app-table-card>
          </div>

          <ng-template #noStatusTable>
            <div class="empty-state-small">
              <p class="empty-state-text">No status data available</p>
            </div>
          </ng-template>
        </section>

        <!-- TICKETS BY PRIORITY -->
        <section class="report-section">
          <div class="section-header">
            <h3 class="section-title">Tickets by Priority</h3>
            <p class="section-description">Breakdown of tickets by priority levels</p>
          </div>

          <div class="chart-wrapper" *ngIf="priorityLabels.length; else noPriorityChart">
            <app-bar-chart
              chartId="priorityReportChart"
              [labels]="priorityLabels"
              [data]="priorityCounts"
              title="Tickets by Priority">
            </app-bar-chart>
          </div>

          <ng-template #noPriorityChart>
            <div class="empty-state-small">
              <p class="empty-state-text">No chart data available</p>
            </div>
          </ng-template>

          <div class="table-card-wrapper" *ngIf="ticketsByPriority.length; else noPriorityTable">
            <app-table-card [rows]="ticketsByPriority"></app-table-card>
          </div>

          <ng-template #noPriorityTable>
            <div class="empty-state-small">
              <p class="empty-state-text">No priority data available</p>
            </div>
          </ng-template>
        </section>
      </div>

      <!-- TICKETS BY CATEGORY -->
      <section class="report-section">
        <div class="section-header">
          <h3 class="section-title">Tickets by Category</h3>
          <p class="section-description">Distribution of tickets across different categories</p>
        </div>

        <div class="chart-wrapper" *ngIf="categoryLabels.length; else noCategoryChart">
          <app-bar-chart
            chartId="categoryReportChart"
            [labels]="categoryLabels"
            [data]="categoryCounts"
            title="Tickets by Category">
          </app-bar-chart>
        </div>

        <ng-template #noCategoryChart>
          <div class="empty-state-small">
            <p class="empty-state-text">No chart data available</p>
          </div>
        </ng-template>

        <div class="table-card-wrapper" *ngIf="ticketsByCategory.length; else noCategoryTable">
          <app-table-card [rows]="ticketsByCategory"></app-table-card>
        </div>

        <ng-template #noCategoryTable>
          <div class="empty-state-small">
            <p class="empty-state-text">No category data available</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .reports-header {
      margin-bottom: 32px;
    }

    .reports-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .reports-subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 400;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .report-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
      margin-bottom: 24px;
    }

    .report-section:hover {
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

    .table-wrapper {
      overflow-x: auto;
      margin-top: 8px;
    }

    .sla-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 8px;
    }

    .sla-table thead {
      position: sticky;
      top: 0;
    }

    .sla-table th {
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

    .sla-table th:first-child {
      border-top-left-radius: 8px;
    }

    .sla-table th:last-child {
      border-top-right-radius: 8px;
    }

    .sla-table tbody tr {
      transition: background-color 0.15s ease;
    }

    .sla-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .sla-table tbody tr:last-child td {
      border-bottom: none;
    }

    .sla-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      font-size: 14px;
    }

    .metric-name {
      font-weight: 500;
      color: #475569;
    }

    .metric-value {
      font-weight: 600;
      color: #1e293b;
      text-align: right;
    }

    .metric-value.highlight {
      color: #2563eb;
      font-size: 16px;
    }

    .chart-wrapper {
      margin-top: 8px;
      margin-bottom: 20px;
    }

    .table-card-wrapper {
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

    .empty-state-small {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      margin-top: 8px;
    }

    .empty-state-text {
      font-size: 16px;
      font-weight: 500;
      color: #64748b;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .reports-title {
        font-size: 24px;
      }

      .report-section {
        padding: 16px;
      }

      .section-title {
        font-size: 18px;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {

  /* ================= SLA REPORT ================= */
  slaComplianceRows: { metric: string; value: string | number }[] = [];

  /* ================= RAW TABLE DATA ================= */
  ticketsByStatus: any[] = [];
  ticketsByPriority: any[] = [];
  ticketsByCategory: any[] = [];

  /* ================= CHART DATA ================= */
  statusLabels: string[] = [];
  statusCounts: number[] = [];

  priorityLabels: string[] = [];
  priorityCounts: number[] = [];

  categoryLabels: string[] = [];
  categoryCounts: number[] = [];

  constructor(
    private reporting: ReportingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSlaCompliance();
    this.loadStatusReport();
    this.loadPriorityReport();
    this.loadCategoryReport();
  }

  /* ================= LOADERS ================= */

  private loadSlaCompliance(): void {
    this.reporting.getSlaCompliance().subscribe(res => {
      this.slaComplianceRows = [
        { metric: 'Total Tickets', value: res.totalTickets },
        { metric: 'Breached Tickets', value: res.breachedTickets },
        { metric: 'SLA Compliance %', value: `${res.compliancePercentage}%` }
      ];
      this.cdr.detectChanges();
    });
  }

  private loadStatusReport(): void {
    this.reporting.getTicketsByStatus().subscribe(res => {
      this.ticketsByStatus = res ?? [];
      this.statusLabels = res.map(x => x.label);
      this.statusCounts = res.map(x => x.count);
      this.cdr.detectChanges();
    });
  }

  private loadPriorityReport(): void {
    this.reporting.getTicketsByPriority().subscribe(res => {
      this.ticketsByPriority = res ?? [];
      this.priorityLabels = res.map(x => x.label);
      this.priorityCounts = res.map(x => x.count);
      this.cdr.detectChanges();
    });
  }

  private loadCategoryReport(): void {
    this.reporting.getTicketsByCategory().subscribe(res => {
      this.ticketsByCategory = res ?? [];
      this.categoryLabels = res.map(x => x.label);
      this.categoryCounts = res.map(x => x.count);
      this.cdr.detectChanges();
    });
  }
}
