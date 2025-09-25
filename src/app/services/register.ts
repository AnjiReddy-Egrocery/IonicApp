import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDataResponse {
  status: string;
  errorCode: string;
  message: string;
  result: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, mobile: string, password: string): Observable<UserDataResponse> {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('emailId', email);
    formData.append('mobileNumber', mobile);
    formData.append('pwd', password);

    const url = '/api/users/userRegistration';
     return this.http.post<UserDataResponse>(url, formData);
  }

  verifyOtp(registerId: string, otp: string): Observable<UserDataResponse> {
    const formData = new FormData();
    formData.append('registerId', registerId);
    formData.append('otp', otp);
    const url = '/api/users/verifyUserAccount';
    return this.http.post<UserDataResponse>(url, formData);
  }
}