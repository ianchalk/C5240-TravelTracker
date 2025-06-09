import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    console.log('HeaderComponent initialized');
    
    // Refresh authentication status when component loads
    this.authService.checkAuthStatus().subscribe();
    
    // Subscribe to authentication status
    const authSub = this.authService.isAuthenticated$.subscribe(
      (isAuth: boolean) => {
        console.log('Authentication status changed:', isAuth);
        this.isAuthenticated = isAuth;
      }
    );
    
    // Subscribe to current user
    const userSub = this.authService.currentUser$.subscribe(
      (user: any) => {
        console.log('Current user changed:', user);
        this.currentUser = user;
      }
    );

    this.subscriptions.push(authSub, userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeUserDropdown();
      this.closeMobileMenu();
    }
  }

  // Debug method to manually check authentication status
  debugCheckAuth(): void {
    console.log('=== DEBUG: Manual Auth Check ===');
    console.log('Current isAuthenticated:', this.isAuthenticated);
    console.log('Current user:', this.currentUser);
    
    this.authService.checkAuthStatus().subscribe({
      next: (status) => {
        console.log('Auth check response:', status);
      },
      error: (error) => {
        console.error('Auth check error:', error);
      }
    });
  }
}
