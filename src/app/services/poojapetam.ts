import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';

export interface PetamResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class Poojapetam {
private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Decorators';   // ✅ no trailing slash

  constructor() {}

  async getDecoratorsList(): Promise<PetamResponse> {
   console.log('➡️ Calling Decarators API...');

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
      return parsed as PetamResponse;
    } catch (error) {
      console.error('❌ PetamService Error:', error);
      throw error;
    }
  }
}