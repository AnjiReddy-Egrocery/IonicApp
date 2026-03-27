import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface ForgotDataResponse {
  status: string;
  errorCode: string;
  message: string;
  result: any;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPassword {
  private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Users';

 async forgotPassword(userName: string) {
  // ✅ Prepare key-value pairs like Postman form-data
  const data: any = {
    userName: userName
   };

  // ✅ Only append password if user entered one
 

  console.log('➡️ RegisterService FormData:', data);

  try {
    // ✅ Send as multipart/form-data (same as Postman)
    const response = await Http.request({
      method: 'POST',
      url: `${this.baseUrl}/requestToResetPassword`,
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
    return parsed as ForgotDataResponse;
  } catch (error) {
    console.error('❌ RegisterService Error:', error);
    throw error;
  }
}
}

