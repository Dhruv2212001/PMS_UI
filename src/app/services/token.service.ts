import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenExpirationService {
  private tokenCheckInterval: any;

  constructor(private router: Router) {}

  // Helper method to ensure localStorage is only accessed in browser environments
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // startCheckingToken() {
  //   if (this.isBrowser()) {
  //     // Check every minute if token is expired
  //     this.tokenCheckInterval = setInterval(() => {
  //       const token =  localStorage.getItem('token');
  //       if (token && this.isTokenExpired(token)) {
  //         this.handleTokenExpiry();
  //       }
  //     }, 5000); // Check every 5 seconds
  //   }
  // }

  // getToken(): string | null {
  //   if (this.isBrowser()) {
  //     return localStorage.getItem('token');
  //   }
  //   return null;
  // }

  // isTokenExpired(token: string): boolean {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     const expiryTime = payload.exp * 1000; // Convert expiry time to milliseconds
  //     const currentTime = new Date().getTime();
  //     return expiryTime < currentTime;
  //   } catch (error) {
  //     console.error('Failed to parse token:', error);
  //     return true;
  //   }
  // }

  // handleTokenExpiry() {
  //   alert('Your session has expired. Please log in again.');
  //   if (this.isBrowser()) {
  //     localStorage.removeItem('token');
  //   }
  //   clearInterval(this.tokenCheckInterval); // Stop checking
  //   this.router.navigate(['/login']); // Navigate to login page
  // }
}
