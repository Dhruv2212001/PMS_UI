import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TokenExpirationService } from './services/token.service';
// import { HeaderComponent } from "./public/pages/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pms';
  isLoggedIn = false;
  tokenCheckInterval: any
  constructor(private tokenExpirationService: TokenExpirationService, private router: Router) { }

  ngOnInit() {
    this.startTokenCheckInterval()
  }

  startTokenCheckInterval() {
    if (typeof window !== 'undefined') {
      // Set an interval to check the token every 5 seconds
      this.tokenCheckInterval = setInterval(() => {
        // Call your token checking logic here
        let token = localStorage.getItem('token');
        let isExpired: boolean = true;
        if (token !== null) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiryTime = payload.exp * 1000; // Convert expiry time to milliseconds
          const currentTime = new Date().getTime();
          isExpired = expiryTime < currentTime ? true : false;
          if (isExpired) {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        }
      }, 5000); // 5000ms = 5 seconds
    }
  }
}
