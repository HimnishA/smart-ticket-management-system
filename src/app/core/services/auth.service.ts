import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: number;
    email: string;
    roles: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get roles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('expiresAt', response.expiresAt);
        localStorage.setItem('roles', JSON.stringify(response.user.roles ?? []));
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userId', String(response.user.userId));
      })
    );
  }

  register(fullName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/auth/register', { fullName, email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('roles');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
  }
}
