import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketStatus } from '../../../core/enums/ticket-status.enum';
import { ToastrService } from 'ngx-toastr';



@Component({
  standalone: true,
  selector: 'app-ticket-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  ticketId!: number;

  ticket: any = null;
  comments: any[] = [];
  newComment: string = '';

  activities: any[] = [];
  showActivities = false;

  loading: boolean = true;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Determine current user's primary role (if any)
    const roles = this.auth.roles ?? [];
    this.userRole = roles.length > 0 ? roles[0] : null;

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (!idParam) {
        console.error('Ticket ID missing in route');
        this.loading = false;
        return;
      }

      const id = Number(idParam);

      if (isNaN(id)) {
        console.error('Invalid Ticket ID:', idParam);
        this.loading = false;
        return;
      }

      this.ticketId = id;

      this.fetchTicketData();
    });
  }

  /**
   * Load ticket + comments together
   * Ensures change detection runs once
   */
  private fetchTicketData(): void {
    this.loading = true;

    this.ticketService.getTicketDetails(this.ticketId).subscribe({
      next: (ticketRes) => {
        this.zone.run(() => {
          console.log('TICKET DETAILS', ticketRes);

          this.ticket = ticketRes;

          // Load comments AFTER ticket loads
          this.loadComments();
          this.loadActivities();
          this.loading = false;

          // FORCE UI REFRESH
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Ticket load failed', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadComments(): void {
    this.ticketService.getTicketComments(this.ticketId).subscribe({
      next: (res) => {
        this.zone.run(() => {
          console.log('COMMENTS', res);
          this.comments = res ?? [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Comments load failed', err)
    });
  }

  // -------------------------
  // ESCALATION (END USER ONLY)
  // -------------------------
  escalate(): void {
    if (!this.ticket || this.ticket.isEscalated) return;

    this.ticketService.escalateTicket(this.ticketId).subscribe({
      next: () => {
        // Update UI instantly
        this.ticket.isEscalated = true;
        this.ticket.escalatedAt = new Date();

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Escalation failed', err)
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    this.ticketService.addTicketComment(this.ticketId, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
      },
      error: (err) => console.error('Add comment failed', err)
    });
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

  cancelTicket(): void {
    if (!confirm('Are you sure you want to cancel this ticket?')) return;

    this.ticketService.cancelTicket(this.ticketId).subscribe({
      next: () => {
        this.ticket.status = 'Cancelled';
      },
      error: err => console.error('Cancel failed', err)
    });
  }

  reopenTicket(): void {
    if (!confirm('Reopen this ticket?')) return;

    this.ticketService.reopenTicket(this.ticketId).subscribe({
      next: () => {
        this.ticket.status = 'Reopened';
      },
      error: err => console.error('Reopen failed', err)
    });
  }

  getAllowedNextStatuses(currentStatus: string): string[] {
    const transitions: Record<string, string[]> = {
      Assigned: ['InProgress'],
      InProgress: ['Resolved'],
      Resolved: ['Closed'],
      Reopened: ['Assigned']

    };

    return transitions[currentStatus] ?? [];
  }

  updateStatus(newStatus: string): void {
    if (!this.ticket) return;

    // Convert string → enum number
    const enumValue = TicketStatus[newStatus as keyof typeof TicketStatus];

    if (!enumValue) {
      console.error('Invalid status selected:', newStatus);
      return;
    }

    this.ticketService.updateTicketStatus(this.ticket.ticketId, enumValue)
      .subscribe({
        next: () => {
          // Update UI immediately
          this.ticket.status = newStatus;
          this.toastr.success('Status Updated Successfully!');
          console.log('Status updated to', newStatus);
        },
        error: (err) => {
          this.toastr.error('Invalid Status Update');
          console.error('Failed to update status', err);
        }
      });
  }

  loadActivities(): void {
    this.ticketService.getTicketActivities(this.ticketId).subscribe({
      next: (res) => {
        console.log('ACTIVITIES', res);
        this.activities = res ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load activities', err)
    });
  }

  toggleActivities(): void {
    this.showActivities = !this.showActivities;

    if (this.showActivities && this.activities.length === 0) {
      this.loadActivities();
    }
  }


  
  
}







