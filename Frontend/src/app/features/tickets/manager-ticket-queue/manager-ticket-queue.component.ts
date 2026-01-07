import { Router } from '@angular/router';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TicketService } from '../../../core/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAssignDialogComponent } from '../../../shared/components/confirm-assign-dialog.component';

@Component({
  selector: 'app-manager-ticket-queue',
  standalone: true,
  imports: [
  CommonModule,
  MatTableModule,
  MatSelectModule,
  MatPaginatorModule,
  MatFormFieldModule
  ],
  templateUrl: './manager-ticket-queue.component.html',
  styleUrls: ['./manager-ticket-queue.component.scss']
})
export class ManagerTicketQueueComponent implements OnInit {

  displayedColumns = [
    'title',
    'category',
    'priority',
    'status',
    'escalated',
    'sla',
    'assignedTo',
    'assign'
  ];

  tickets: any[] = [];
  agents: any[] = [];

  // Pagination
  page = 1;
  pageSize = 10;
  totalCount = 0;

  // Loading
  loading = false;

  // Filters
  statusFilter?: string;
  priorityFilter?: number;
  slaBreachedFilter?: boolean;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQueue();
    this.loadAgents();
  }

  // -------------------------
  // LOAD QUEUE
  // -------------------------
  loadQueue(): void {
    this.loading = true;

    this.ticketService.getManagerQueue(
        this.page,
        this.pageSize,
        this.statusFilter,
        this.priorityFilter
    ).subscribe(res => {

        

        let items = res?.items ?? [];

        // ✅ CLIENT-SIDE SLA FILTER
        if (this.slaBreachedFilter !== undefined && this.slaBreachedFilter !== null) {
        items = items.filter(
            (t: any) => t.isSlaBreached === this.slaBreachedFilter
        );
        }

        this.tickets = items;
        this.totalCount = res?.totalCount ?? 0;

        this.loading = false;
        this.cdr.detectChanges();
    });
   }


  // -------------------------
  // LOAD AGENTS
  // -------------------------
  loadAgents(): void {
    this.ticketService.getAvailableSupportAgents()
      .subscribe(res => {
        this.agents = res ?? [];
        this.cdr.detectChanges();
      });
  }

  // -------------------------
  // FILTER HANDLER
  // -------------------------
  onFilterChange(): void {
    this.page = 1;
    this.loadQueue();
  }

  // -------------------------
  // ASSIGN WITH CONFIRMATION
  // -------------------------
  assign(ticketId: number, userId: number): void {
    const agent = this.agents.find(a => a.userId === userId);

    const dialogRef = this.dialog.open(ConfirmAssignDialogComponent, {
      width: '400px',
      data: {
        agentName: agent?.fullName ?? 'this agent'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.ticketService.assignTicket(ticketId, userId)
        .subscribe(() => {
          this.loadQueue();
        });
    });
  }

  // -------------------------
  // PAGINATION
  // -------------------------
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadQueue();
  }

  openDetails(ticketId: number): void {
    this.router.navigate(['/manager/tickets', ticketId]);
  }

  getPriorityClass(priority: string): string {
    const priorityLower = priority?.toLowerCase() || '';
    if (priorityLower.includes('low')) return 'low';
    if (priorityLower.includes('medium')) return 'medium';
    if (priorityLower.includes('high')) return 'high';
    return 'low';
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('created')) return 'created';
    if (statusLower.includes('assigned')) return 'assigned';
    if (statusLower.includes('progress')) return 'inprogress';
    return 'created';
  }
}
