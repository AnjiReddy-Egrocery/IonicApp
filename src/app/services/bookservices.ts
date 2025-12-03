import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';


export interface BooksResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class Bookservices {
private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Books';   // ✅ no trailing slash

  constructor() {}

  async getBookList(): Promise<BooksResponse> {
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
      return parsed as BooksResponse;
    } catch (error) {
      console.error('❌ BajanamandaliService Error:', error);
      throw error;
    }
  }
}