import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http } from "@capacitor-community/http";
import { Capacitor } from "@capacitor/core";
import { Observable } from "rxjs";

export interface LoginDataResponse {
    status: string;
  errorCode: string;
  message: string;
  result: any;
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {
 private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Users';

 async login(loginMobile: string, loginPassword: string) {
  // ✅ Prepare key-value pairs like Postman form-data
  const data: any = {
    loginMobile: loginMobile,
    loginPassword: loginPassword,
   
  };

  // ✅ Only append password if user entered one
 

  console.log('➡️ RegisterService FormData:', data);

  try {
    // ✅ Send as multipart/form-data (same as Postman)
    const response = await Http.request({
      method: 'POST',
      url: `${this.baseUrl}/userLogin`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data
    });

    console.log('➡️ API Raw Response:', response.data);

    // ✅ Normalize iOS string response
    const parsed =
      typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;

    console.log('✅ Parsed API Response:', parsed);
    return parsed as LoginDataResponse;
  } catch (error) {
    console.error('❌ RegisterService Error:', error);
    throw error;
  }
}
}