import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';


export interface CalenderResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class Calender { 
  private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Calendar';

  async getCalendar(year: string) {
    const data = { year };
    console.log('➡️ CalenderService FormData:', data);

    try {
      const response = await Http.request({
        method: 'POST',
        url: `${this.baseUrl}/index`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });

      console.log('➡️ API Raw Response:', response.data);
      const parsed =
        typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      console.log('✅ Parsed API Response:', parsed);
      return parsed as CalenderResponse;
    } catch (error) {
      console.error('❌ CalenderService Error:', error);
      throw error;
    }
  }
}