import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private baseUrl =
    'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/invoice/create`, data, { observe: 'response', withCredentials: true });
  }

  getAllByEmp(): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/allemployeeinvoice`, { observe: 'response', withCredentials: true });
  }

  getAllByAccountant(page: any, limit: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/allInvoice?page=${page}&limit=${limit}`, { observe: 'response', withCredentials: true });
  }

  getEmpInvoiceById(id: any, page: any, limit: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/employee/${id}?page=${page}&limit=${limit}`, { observe: 'response', withCredentials: true });
  }

  getInvoiceById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/${id}`, { observe: 'response', withCredentials: true });
  }

  updateById(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/invoice`, data, { observe: 'response', withCredentials: true });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}invoice/${id}`, { observe: 'response', withCredentials: true });
  }
}
