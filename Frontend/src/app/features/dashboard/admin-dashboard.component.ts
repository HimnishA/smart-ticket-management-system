import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatCardComponent } from '../../shared/components/stat-card.component';
import { ReportingService } from '../../core/services/reporting.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    StatCardComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- HEADER -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Admin Dashboard</h1>
        <p class="dashboard-subtitle">Manage system configuration and user administration</p>
      </div>

      <!-- KPI SECTION -->
      <section class="kpi-section">
        <app-stat-card
          title="Total Users"
          [value]="'' + totalUsers"
          colorClass="green">
        </app-stat-card>

        <app-stat-card
          title="Pending Approvals"
          [value]="'' + pendingUsers"
          colorClass="amber">
        </app-stat-card>
      </section>

      <!-- GOVERNANCE TABLE -->
      <section class="table-section">
        <div class="section-header">
          <h3 class="section-title">System Configuration Health</h3>
          <p class="section-description">Overview of active and inactive system entities</p>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Active</th>
                <th>Inactive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="entity-name">
                  <span class="entity-icon">📁</span>
                  Categories
                </td>
                <td class="count active-count">{{ activeCategories }}</td>
                <td class="count inactive-count">{{ inactiveCategories }}</td>
              </tr>

              <tr>
                <td class="entity-name">
                  <span class="entity-icon">⚡</span>
                  Priorities
                </td>
                <td class="count active-count">{{ activePriorities }}</td>
                <td class="count inactive-count">{{ inactivePriorities }}</td>
              </tr>

              <tr>
                <td class="entity-name">
                  <span class="entity-icon">⏱️</span>
                  SLA Policies
                </td>
                <td class="count active-count">{{ activeSlas }}</td>
                <td class="count inactive-count">{{ inactiveSlas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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

    .table-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
    }

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

    .table-wrapper {
      overflow-x: auto;
      margin-top: 8px;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 8px;
    }

    .data-table thead {
      position: sticky;
      top: 0;
    }

    .data-table th {
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

    .data-table th:first-child {
      border-top-left-radius: 8px;
    }

    .data-table th:last-child {
      border-top-right-radius: 8px;
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

    .entity-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .entity-icon {
      font-size: 18px;
    }

    .count {
      font-weight: 600;
      text-align: right;
    }

    .active-count {
      color: #166534;
    }

    .inactive-count {
      color: #991b1b;
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

      .table-section {
        padding: 16px;
      }

      .section-title {
        font-size: 18px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  // KPI
  totalUsers = 0;
  pendingUsers = 0;

  // Governance metrics
  activeCategories = 0;
  inactiveCategories = 0;

  activePriorities = 0;
  inactivePriorities = 0;

  activeSlas = 0;
  inactiveSlas = 0;

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.reportingService.getAdminDashboard().subscribe(res => {

      this.totalUsers = res.totalUsers;
      this.pendingUsers = res.pendingUserApprovals;

      this.activeCategories = res.activeCategories;
      this.inactiveCategories = res.inactiveCategories;

      this.activePriorities = res.activePriorities;
      this.inactivePriorities = res.inactivePriorities;

      this.activeSlas = res.activeSlaPolicies;
      this.inactiveSlas = res.inactiveSlaPolicies;

      // Required for async standalone rendering
      this.cdr.detectChanges();
    });
  }
}
