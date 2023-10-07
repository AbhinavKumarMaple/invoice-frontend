import { HttpClient } from '@angular/common/http';
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

  getAllCustomer(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/getall`, { observe: 'response', withCredentials: true });
  }

  getCustomerByID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/get/ID`, { observe: 'response', withCredentials: true });
  }

  removeCustomer(id: any) {
    return this.http.delete(`${this.baseUrl}/customer/delete/${id}`, { observe: 'response', withCredentials: true })
  }
}
