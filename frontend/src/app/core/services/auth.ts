import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, CreateUserRequest, UserResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiPath = '/Users';
  
  private authToken = signal<string | null>(this.getStoredToken());
  private currentUser = signal<UserResponse | null>(this.getStoredUser());
  
  isAuthenticated = signal<boolean>(!!this.authToken());

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiPath}/login`, request).pipe(
      tap((response) => {
        this.setAuthData(response.token, {
          userId: response.userId,
          email: response.email,
          name: response.email,
          createdAt: new Date().toISOString(),
        });
      })
    );
  }

  register(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiPath}/register`, request).pipe(
      tap((user) => {
        // After registration, user needs to login separately
        // So we don't auto-set auth here
      })
    );
  }

  logout(): void {
    this.authToken.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }

  private setAuthData(token: string, user: UserResponse): void {
    this.authToken.set(token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getStoredUser(): UserResponse | null {
    const stored = localStorage.getItem('current_user');
    return stored ? JSON.parse(stored) : null;
  }

  getToken(): string | null {
    return this.authToken();
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUser();
  }
}
