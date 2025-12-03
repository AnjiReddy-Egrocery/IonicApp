import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';
export interface SharanughoshaModel {
  status: string;
  errorCode: string;
  imageUrl: string;
  message: string;
  result: {
    title: string;
    smallDescription: string;
    description: string;
    image: string;
  }[];
}
@Injectable({
  providedIn: 'root'
})
export class Sharanughosha {
  private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Activities'; // ✅ Actual base path

  constructor() {}
 

  async getActivityById(activityId: string = '21'): Promise<SharanughoshaModel> {
    const data = { activitiesId: activityId };
    console.log('➡️ NityaPoojaService FormData:', data);

    try {
      const response = await Http.request({
        method: 'POST',
        url: `${this.baseUrl}/info`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });

      console.log('➡️ Raw API Response:', response.data);

      const parsed =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      console.log('✅ Parsed API Response:', parsed);
      return parsed as SharanughoshaModel;
    } catch (error) {
      console.error('❌ SharanughosaService Error:', error);
      throw error;
    }
  }
}
