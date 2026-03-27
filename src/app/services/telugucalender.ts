import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface PanchangDay {
  id?: string;
  date?: string;
  data?: {
    data?: {
      vaara?: string;
      tithi?: { name: string }[];
      nakshatra?: { name: string }[];
      sunrise?: string;
      sunset?: string;
    };
  };
}

export interface TeluguCalenderDataResponse {
  status: string;
  data?: PanchangDay[];
}

@Injectable({
  providedIn: 'root'
})
export class Telugucalender {

     private baseUrl = 'https://www.ayyappatelugu.com/APICalls';

  async getAyyappaCalendar(month: number, year: number) {
    // Form urlencoded data
    const body = new URLSearchParams();
    body.set('month', month.toString());
    body.set('year', year.toString());

    console.log('➡️ CalenderService FormData:', body.toString());

    try {
      const response = await Http.request({
        method: 'POST',
        url: `${this.baseUrl}/panchangmonth`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: body.toString(),
      });

      console.log('➡️ API Raw Response:', response.data);
      const parsed = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      console.log('✅ Parsed API Response:', parsed);
      return parsed as TeluguCalenderDataResponse;

    } catch (error) {
      console.error('❌ CalenderService Error:', error);
      throw error;
    }
  }
}