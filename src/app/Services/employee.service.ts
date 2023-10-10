import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  employeeInfoById(id?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/myinfo/${id}`, { observe: 'response', withCredentials: true });
  }

  employeeUnderAccountant(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/`, { observe: 'response', withCredentials: true })
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/update/${id}`, data, { observe: 'response', withCredentials: true });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/delete/${id}`, { observe: 'response', withCredentials: true });
  }

  addImage(data: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/upload-image/id=${id}`, data, {
      observe: 'response',
      withCredentials: true,
    });
  }

  deleteImage(id: any, imageId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/remove-image/id=${imageId}&employeeId=${id}`, { observe: 'response', withCredentials: true });
  }
}
