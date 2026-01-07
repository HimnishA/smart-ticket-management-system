import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private readonly baseUrl = '/api/admin/master-data';

  constructor(private http: HttpClient) {}

  // -------------------------
  // CATEGORIES
  // -------------------------
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  createCategory(data: { name: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/categories`, data);
  }

  deactivateCategory(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/categories/${id}/deactivate`, { id });
  }

  activateCategory(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/categories/${id}/activate`, { id });
  }

  // -------------------------
  // PRIORITIES
  // -------------------------
  getPriorities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/priorities`);
  }

  createPriority(data: { name: string; level: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/priorities`, data);
  }

  deactivatePriority(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/priorities/${id}/deactivate`, { id });
  }

  activatePriority(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/priorities/${id}/activate`, { id });
  }

  // -------------------------
  // SLA POLICIES
  // -------------------------
  getSlas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/slas`);
  }

  createSla(data: { name: string; resolutionHours: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/slas`, data);
  }

  deactivateSla(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/slas/${id}/deactivate`, { id });
  }

  activateSla(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/slas/${id}/activate`, { id });
  }

  // -------------------------
  // USER MANAGEMENT
  // -------------------------
  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`/api/admin/users/pending`);
  }

  approveUser(userId: number, roleIds: number[]): Observable<any> {
    return this.http.post<any>(`/api/admin/users/${userId}/approve`, { roleIds });
  }

  rejectUser(userId: number): Observable<any> {
    return this.http.post<any>(`/api/admin/users/${userId}/reject`, null);
  }
}

