import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface LoginDataResponse {
  status: string;
  errorCode: string;
  imageUrl: string;
  result: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginDataResponse> {
    const formData = new FormData();
    formData.append('loginMobile', email);
    formData.append('loginPassword', password);

    const url = '/api/users/userLogin'; // ✅ use /api/users
    return this.http.post<LoginDataResponse>(url, formData);
  }
}