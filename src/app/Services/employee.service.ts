import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl =
    'https://invoice-backend-nodejs-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/login`, data, { observe: 'response', withCredentials: true });
  }

  loginByToken(token: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/login?token=${token}`, null, { observe: 'response', withCredentials: true });
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/register`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }
  employeeInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/employeeinfo`, { observe: 'response', withCredentials: true });
  }

  employeeInfoById(data: any): Observable<any> {
    console.log(data)
    return this.http.get(`${this.baseUrl}/employee/myinfo/${data._id}`, { observe: 'response', withCredentials: true });
  }
  InvoiceInfoById(data: any): Observable<any> {
    console.log(data)
    return this.http.get(`${this.baseUrl}/employee/myinfo/${data}`, { observe: 'response', withCredentials: true });
  }

  employeeUnderAccountant(page: any, limit: any, data?: any, userName?: any): Observable<any> {
    const params = new HttpParams()
      .set('startDate', data.startDate)
      .set('endDate', data.endDate);
    if (userName && userName?.length > 1) {
      return this.http.get(`${this.baseUrl}/employee?page=${page}&limit=${limit}&username=${userName}`, { params: params, observe: 'response', withCredentials: true })
    }
    else {
      return this.http.get(`${this.baseUrl}/employee?page=${page}&limit=${limit}`, { params: params, observe: 'response', withCredentials: true })
    }
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/update/${id}`, data, { observe: 'response', withCredentials: true });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/delete/${id}`, { observe: 'response', withCredentials: true });
  }

  addImage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/upload-image`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }

  deleteImage(id: any, imageId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/remove-image/id=${imageId}&employeeId=${id}`, { observe: 'response', withCredentials: true });
  }
}
