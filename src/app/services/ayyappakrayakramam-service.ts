import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';

export interface AyyappaKrayakramamResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

export interface AyyappaKrayakramamDetailsResponse {

  status: string;

  errorCode: string;

  imageUrl: string;

  result: AyyappaKrayakramamItem[];

}
export interface AyyappaKrayakramamItem {

  activitiesId: string;

  title: string;

  description: string;

  image: string;

}


@Injectable({
  providedIn: 'root'
})
export class AyyappakrayakramamService {
    private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Activities'; // proxy path

  constructor() { }

  async getKaryakaramamList(): Promise<AyyappaKrayakramamResponse> {
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
      return parsed as AyyappaKrayakramamResponse;
    } catch (error) {
      console.error('❌ BajanamandaliService Error:', error);
      throw error;
    }
  }

   async getKaryakaramDetails(
      activitiesId:string
    ):Promise<AyyappaKrayakramamDetailsResponse>{
  
      const response =
        await Http.request({
  
          method:'POST',
  
          url:
          `${this.baseUrl}/info`,
  
          headers:{
            'Content-Type':
            'multipart/form-data'
          },
  
          data:{
            activitiesId:activitiesId
          }
  
        });
  
      const parsed =
  
        typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;
  
      return parsed as
        AyyappaKrayakramamDetailsResponse;
  
    }
}
