import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {

  private refreshSubscription: Subscription | undefined;

  constructor(private http: HttpClient) { }

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
    this.http.get(`https://invoice-backend-nodejs-production.up.railway.app/api/accountant/refresh-token`, { observe: 'response', withCredentials: true }).subscribe();
  }

  refreshAccessTokenEmployee() {
    this.http.get(`https://invoice-backend-nodejs-production.up.railway.app/api/employee/refresh-token`, { observe: 'response', withCredentials: true }).subscribe();
  }

}
