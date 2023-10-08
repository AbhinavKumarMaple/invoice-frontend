import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AccountantService {
  cookieValue: string;

  private baseUrl =
    'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.cookieValue = this.cookieService.get('token');
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accountant/login`, data, { observe: 'response', withCredentials: true });
  }
  getAccountantInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/accountant/myinfo`, {
      observe: 'response',
      withCredentials: true,
    });
  }
  generateEmpInviteLink(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accountant/invite`, data, { observe: 'response', withCredentials: true });
  }
  updateBank(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/accountant/editbank/${data._id}`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/accountant/update`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }
  removeBank(data: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/accountant/removebank/${data._id}`, {
      observe: 'response',
      withCredentials: true,
    });
  }
  addBank(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accountant/addbank`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }

  addImage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accountant/upload-image`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }

  getImage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/accountant/getlogo`, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
