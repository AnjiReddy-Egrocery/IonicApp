import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface BajanaSongsResponse {
  status: string;
  errorCode: string;
  result?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AyyappaBajanaSongs {

  private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Bajanasongs';

  constructor() {}

  // ✅ POST request without sending any parameters
  async getBajanaSongs(): Promise<BajanaSongsResponse> {
    console.log('➡️ Calling Bajanamandali API...');

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
      return parsed as BajanaSongsResponse;
    } catch (error) {
      console.error('❌ BajanamandaliService Error:', error);
      throw error;
    }
  }

  
}
