import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';

export interface TempleResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

export interface templeDetailsResponse {

  status: string;

  errorCode: string;

  imageUrl: string;

  result: TempleItem[];

}
export interface TempleItem {

  templeId: string;

  templeName: string;

  templeNameTelugu: string;

  openingTime: string;
  closingTime: string;
  location: string;
  image: string;

  latitude:string;     // ADD

  longitude:string; 
}


@Injectable({
  providedIn: 'root'
})
export class Ayyappatemplelist {
   private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Temples';   // ✅ no trailing slash

  constructor() {}

  async getTempleList(): Promise<TempleResponse> {
     console.log('➡️ Calling Anadanam API...');

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
      return parsed as TempleResponse;
    } catch (error) {
      console.error('❌ AnadanamService Error:', error);
      throw error;
    }
  }

    async gettempleDetails(
          templeId:string
        ):Promise<templeDetailsResponse>{
      
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
                templeId:templeId
              }
      
            });
      
          const parsed =
      
            typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
      
          return parsed as
            templeDetailsResponse;
      
        }
}

