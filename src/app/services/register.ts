import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

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

   private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Users';

 async register(firstName: string, lastName: string, email: string, mobile: string, password: string) {
  // ✅ Prepare key-value pairs like Postman form-data
  const data: any = {
    firstName: firstName,
    lastName: lastName,
    emailId: email,
    mobileNumber: mobile,
    isIOS: '1'
  };

  // ✅ Only append password if user entered one
  if (password && password.trim() !== '') {
    data.pwd = password;
  }

  console.log('➡️ RegisterService FormData:', data);

  try {
    // ✅ Send as multipart/form-data (same as Postman)
    const response = await Http.request({
      method: 'POST',
      url: `${this.baseUrl}/userRegistration`,
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
    return parsed as UserDataResponse;
  } catch (error) {
    console.error('❌ RegisterService Error:', error);
    throw error;
  }
}
}