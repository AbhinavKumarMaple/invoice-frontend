import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VatRateService {

  private baseUrl = 'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  generate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vatrate`, data, { observe: 'response', withCredentials: true });
  }

  getVatRate(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vatrate`, { observe: 'response', withCredentials: true });
  }

  deleteVatRate(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vatrate/${id}`, { observe: 'response', withCredentials: true })
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/vatrate/${id}`, data, { observe: 'response', withCredentials: true });
  }

  // getVatRateById(id: any): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/vatrate/${id}`, { observe: 'response', withCredentials: true });
  // }
}
