import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

interface MyResponse {
  expirationTime: string;
  message: string
}

@Injectable({
  providedIn: 'root'
})

export class TokenRefreshService {

  private refreshSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  startTokenRefreshForCustomer() {
    const refreshIntervalMillis = 2100000;
    this.refreshSubscription = interval(refreshIntervalMillis).subscribe(() => this.refreshAccessTokenCustomer());
  }

  startTokenRefreshForEmployee() {
    const refreshIntervalMillis = 2100000;
    this.refreshSubscription = interval(refreshIntervalMillis).subscribe(() => this.refreshAccessTokenEmployee());
  }

  stopTokenRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshAccessTokenCustomer() {
    let expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      let currentDate = new Date(Date.now());
      let isExpired = new Date(currentDate) > new Date(expirationTime);
      if (!isExpired) {
        this.http.get<MyResponse>(`https://invoice-backend-nodejs-production.up.railway.app/api/accountant/refresh-token`, { observe: 'response', withCredentials: true }).subscribe(response => {
          if (response.body) {
            localStorage.setItem('expirationTime', response.body.expirationTime)
          }
        });
      }
      else {
        this.router.navigate(['/login']);
      }
    }
    else {
      this.router.navigate(['/login'])
    }

  }

  refreshAccessTokenEmployee() {
    let expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      let currentDate = new Date(Date.now());
      let isExpired = new Date(currentDate) > new Date(expirationTime);
      if (!isExpired) {
        this.http.get<MyResponse>(`https://invoice-backend-nodejs-production.up.railway.app/api/employee/refresh-token`, { observe: 'response', withCredentials: true }).subscribe(response => {
          if (response.body) {
            localStorage.setItem('expirationTime', response.body.expirationTime)
          }
        });
      }
      else {
        this.router.navigate(['/login'])
      }
    }
    else {
      this.router.navigate(['/login'])
    }
  }

}
