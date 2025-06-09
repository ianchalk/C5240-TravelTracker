import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'travel-tracker';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('AppComponent initialized');
    // Check authentication status on app initialization
    this.authService.checkAuthStatus().subscribe();
  }

  @HostListener('window:focus', ['$event'])
  onWindowFocus(event: any): void {
    console.log('Window focused - checking auth status');
    // Check authentication status when window gets focus (useful after OAuth redirect)
    this.authService.checkAuthStatus().subscribe();
  }
}
