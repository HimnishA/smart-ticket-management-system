import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TicketStatus } from '../enums/ticket-status.enum';


@Injectable({ providedIn: 'root' })
export class TicketService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // -------------------------
  // END USER / AGENT
  // -------------------------
  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/tickets/my`
    );
  }

  createTicket(data: { title: string; description: string; categoryId: number; priorityId: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tickets`, data);
  }

  // -------------------------
  // SUPPORT MANAGER
  // -------------------------

  /**
   * Ticket Queue (server-side filters ONLY)
   * Backend supports:
   * - page
   * - pageSize
   * - status
   * - priorityId
   */
  getManagerQueue(
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    priorityId?: number
  ): Observable<any> {

    const params: any = {
      page,
      pageSize
    };

    if (status && status.trim().length > 0) {
      params.status = status;
    }

    if (priorityId !== undefined && priorityId !== null) {
      params.priorityId = priorityId;
    }

    return this.http.get<any>(
      `${this.baseUrl}/support-manager/queue`,
      { params }
    );
  }

  // -------------------------
  // AGENT LOOKUP
  // -------------------------
  getAvailableSupportAgents(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/support-manager/agents/available`
    );
  }

  // -------------------------
  // ASSIGN / REASSIGN
  // -------------------------
  assignTicket(
    ticketId: number,
    assignToUserId: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/support-manager/assignments`,
      { ticketId, assignToUserId }
    );
  }

  getTicketDetails(ticketId: number) {
    return this.http.get<any>(
        `/api/tickets/${ticketId}`
    );
  }

  getTicketComments(ticketId: number) {
    return this.http.get<any[]>(
        `/api/tickets/${ticketId}/comments`
    );
    }

  addTicketComment(ticketId: number, content: string) {
    return this.http.post<void>(
        `/api/tickets/${ticketId}/comments`,
        { content }
    );
    }
    escalateTicket(ticketId: number) {
      return this.http.post<void>(
        `/api/tickets/${ticketId}/escalate`,
        {}
      );
    }

    cancelTicket(ticketId: number) {
      return this.http.post<void>(`/api/tickets/${ticketId}/cancel`, {});
    }

    reopenTicket(ticketId: number) {
      return this.http.post<void>(`/api/tickets/${ticketId}/reopen`, {});
    }

    updateTicketStatus(ticketId: number, newStatus: number) {
  

      return this.http.put<void>(
        `/api/tickets/status`,
        {
          ticketId,
          newStatus 
        }
      );
    }

    getTicketActivities(ticketId: number) {
      return this.http.get<any[]>(
        `/api/tickets/${ticketId}/activities`
      );
    }
    
}
