import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface PanchangResponse {
  status: string;
  source?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class Panchangam {
  private baseUrl = 'https://www.ayyappatelugu.com/APICalls';

  async getPanchang(date: string): Promise<PanchangResponse> {
    const data = { date };
    console.log('➡️ PanchangService FormData:', data);

    try {
      const response = await Http.request({
        method: 'POST',
        url: `${this.baseUrl}/panchang`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });

      console.log('➡️ API Raw Response:', response.data);

      const parsed =
        typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      console.log('✅ Parsed API Response:', parsed);
      return parsed as PanchangResponse;
    } catch (error) {
      console.error('❌ PanchangService Error:', error);
      throw error;
    }
  }
}

