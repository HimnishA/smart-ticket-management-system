import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportingService {

  // REPORTS (Support Manager)
  private baseUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  // -------------------------
  // MANAGER REPORTS (PHASE 6)
  // -------------------------

  getSlaCompliance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sla-compliance`);
  }

  getAverageResolutionTime(): Observable<any> {
    return this.http.get(`${this.baseUrl}/average-resolution-time`);
  }

  getTicketsByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tickets-by-status`);
  }

  getTicketsByPriority(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tickets-by-priority`);
  }

  getTicketsByCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tickets-by-category`);
  }

  getAgentWorkload(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agent-workload`);
  }

  // -------------------------
  // SUPPORT AGENT DASHBOARD
  // -------------------------

  getAgentDashboard(): Observable<any> {
    // NOTE: This endpoint is NOT under /reports
    return this.http.get<any>('/api/agent/dashboard');
  }

  // -------------------------
  // END USER DASHBOARD
  // -------------------------

  getUserDashboard() {
  return this.http.get<any>('/api/user/dashboard');
  }

  getAdminDashboard() {
  return this.http.get<any>('/api/admin/dashboard');
  }


}
