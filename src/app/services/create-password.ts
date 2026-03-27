import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface CreatePassword {
  status: string;
  errorCode: string;
  message: string;
  result: any;
}

@Injectable({
  providedIn: 'root'
})
export class CreatePassword {
   private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Users';

 async resetPassword(registerId: string, otp: string, pwd: string) {
  // ✅ Prepare key-value pairs like Postman form-data
  const data: any = {
    registerId: registerId,
    otp: otp,
    pwd: pwd
  };

  // ✅ Only append password if user entered one
 

  console.log('➡️ RegisterService FormData:', data);

  try {
    // ✅ Send as multipart/form-data (same as Postman)
    const response = await Http.request({
      method: 'POST',
      url: `${this.baseUrl}/updateAccountPassword`,
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
    return parsed as CreatePassword;
  } catch (error) {
    console.error('❌ RegisterService Error:', error);
    throw error;
  }
}
}

