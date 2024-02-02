import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private baseUrl =
    'invoice-backend-nodejs-production-up.up.railway.app/api';

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/invoice/create`, data, { observe: 'response', withCredentials: true });
  }

  getAllByEmp(page: any, limit: any, data: any, userName?: any): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    if (userName && userName?.length > 1) {
      return this.http.get(`${this.baseUrl}/invoice/allemployeeinvoice?page=${page}&limit=${limit}&username=${userName}`, { params: params, observe: 'response', withCredentials: true });
    }
    else {
      return this.http.get(`${this.baseUrl}/invoice/allemployeeinvoice?page=${page}&limit=${limit}`, { params: params, observe: 'response', withCredentials: true });
    }
  }

  getAllByAccountant(page: any, limit: any, data: any, userName?: any): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    if (userName && userName?.length > 1) {
      return this.http.get(`${this.baseUrl}/invoice/allInvoice?page=${page}&limit=${limit}&username=${userName}`, { params: params, observe: 'response', withCredentials: true });
    }
    else {
      return this.http.get(`${this.baseUrl}/invoice/allInvoice?page=${page}&limit=${limit}`, { params: params, observe: 'response', withCredentials: true });
    }
  }

  getEmpInvoiceById(id: any, page: any, limit: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/employee/${id}?page=${page}&limit=${limit}`, { observe: 'response', withCredentials: true });
  }

  getInvoiceById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/invoice/${id}`, { observe: 'response', withCredentials: true });
  }

  updateById(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/invoice/${id}`, data, { observe: 'response', withCredentials: true });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/invoice/${id}`, { observe: 'response', withCredentials: true });
  }

  getGeneratedInvoice(page: any, limit: any, data: any, userName?: any): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    if (userName && userName?.length > 1) {
      return this.http.get(`${this.baseUrl}/generatedinvoice?page=${page}&limit=${limit}&username=${userName}`, { params: params, observe: 'response', withCredentials: true })
    }
    else {
      return this.http.get(`${this.baseUrl}/generatedinvoice?page=${page}&limit=${limit}`, { params: params, observe: 'response', withCredentials: true })
    }
  }

  generateInvoice(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/generatedinvoice/create`, data, { observe: 'response', withCredentials: true });
  }

  updateGeneratedInvoiceById(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/generatedinvoice/${id}`, data, { observe: 'response', withCredentials: true });
  }
  deleteGeneratedInvoice(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/generatedinvoice/${id}`, { observe: 'response', withCredentials: true });
  }

}
