import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';


export interface PadayatraResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class Padayatra {
   private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Padayatrabrundams';

  constructor() {}

  // ✅ POST request without sending any parameters
  async getPadayatraList(): Promise<PadayatraResponse> {
    console.log('➡️ Calling Blog API...');

    try {
      const response = await Http.request({
        method: 'POST',
        url: `${this.baseUrl}/index`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // ❌ No parameters needed
        data: {}
      });

      console.log('➡️ Raw API Response:', response.data);

      // ✅ Normalize and parse response
      const parsed =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      console.log('✅ Parsed API Response:', parsed);
      return parsed as PadayatraResponse;
    } catch (error) {
      console.error('❌ BlogService Error:', error);
      throw error;
    }
  }
}

