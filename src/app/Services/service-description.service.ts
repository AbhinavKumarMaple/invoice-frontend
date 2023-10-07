import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDescriptionService {

  private baseUrl = 'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  generate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/servicedesc`, data, { observe: 'response', withCredentials: true });
  }

  getServiceDesc(): Observable<any> {
    return this.http.get(`${this.baseUrl}/servicedesc`, { observe: 'response', withCredentials: true });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/servicedesc/${id}`, { observe: 'response', withCredentials: true })
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/servicedesc/${id}`, data, { observe: 'response', withCredentials: true });
  }
}
