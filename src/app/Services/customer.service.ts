import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/create`, data, { observe: 'response', withCredentials: true });
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customer/update/${id}`, data, { observe: 'response', withCredentials: true });
  }

  addBank(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customer/add-bank/6518473377e11b634a1b990a`, data, { observe: 'response', withCredentials: true }); // need clear logic
  }

  editBankInfo(id: any, bankId: any, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/invoice/edit-bank/?_id=${id}&bankId=${bankId}`, data, { observe: 'response', withCredentials: true });
  }

  removeBankById(id: any, bankId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customer/remove-bank/?_id=${id}&bankid=${bankId}`, { observe: 'response', withCredentials: true });
  }

  getAllCustomer(page: any, limit: any, data?: any, userName?: any): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    if (userName && userName?.length > 1) {
      return this.http.get(`${this.baseUrl}/customer/getall?page=${page}&limit=${limit}&username=${userName}`, { observe: 'response', withCredentials: true });
    }
    else {
      return this.http.get(`${this.baseUrl}/customer/getall?page=${page}&limit=${limit}`, { observe: 'response', withCredentials: true });

    }
  }

  getCustomerByID(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/get/${id}`, { observe: 'response', withCredentials: true });
  }

  removeCustomer(id: any) {
    return this.http.delete(`${this.baseUrl}/customer/delete/${id}`, { observe: 'response', withCredentials: true })
  }
}
