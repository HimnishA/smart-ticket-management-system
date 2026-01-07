import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketMasterDataService {

  private readonly baseUrl = '/api/tickets';

  constructor(private http: HttpClient) {}

  // -------------------------
  // READ-ONLY MASTER DATA
  // -------------------------

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  getPriorities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/priorities`);
  }
}
