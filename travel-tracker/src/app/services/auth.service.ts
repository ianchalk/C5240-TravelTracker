import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface User {
  _id?: string;
  userId?: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  user: User | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://traveltracker2025.azurewebsites.net/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('AuthService initialized');
    // Check authentication status on service initialization
    this.checkAuthStatus().subscribe();
    
    // Check authentication status when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Page became visible - checking auth status');
        this.checkAuthStatus().subscribe();
      }
    });
  }

  // Check if user is currently authenticated
  checkAuthStatus(): Observable<AuthStatus> {
    return this.http.get<AuthStatus>(`${this.baseUrl}/status`, { withCredentials: true })
      .pipe(
        tap(status => {
          console.log('Auth status check result:', status);
          this.isAuthenticatedSubject.next(status.isAuthenticated);
          this.currentUserSubject.next(status.user);
        }),
        catchError(error => {
          console.error('Auth status check failed:', error);
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          return of({ isAuthenticated: false, user: null });
        })
      );
  }

  // Get current user information
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Get current user failed:', error);
          throw error;
        })
      );
  }

  // Initiate Google OAuth login
  loginWithGoogle(): void {
    console.log('Initiating Google login...');
    window.location.href = `${this.baseUrl}/google`;
  }

  // Logout user
  logout(): void {
    console.log('Logging out...');
    this.http.get(`${this.baseUrl}/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          console.error('Logout failed:', error);
          // Even if logout request fails, clear local state
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          return of(null);
        })
      )
      .subscribe(() => {
        window.location.href = '/';
      });
  }

  // Get current user value (synchronous)
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get authentication status (synchronous)
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
