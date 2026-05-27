import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs/internal/Observable';

export interface NewsResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}

export interface NewsDetailsResponse {

  status: string;

  errorCode: string;

  imageUrl: string;

  result: NewsItem[];

}
export interface NewsItem {

  newsId: string;

  newsTitle: string;

  newsDescription: string;

  image: string;

}

@Injectable({
  providedIn: 'root'
})
export class News {
    private baseUrl = 'https://www.ayyappatelugu.com/APICalls/News';   // ✅ no trailing slash

  constructor() {}

  async getNewsList(): Promise<NewsResponse> {
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
      return parsed as NewsResponse;
    } catch (error) {
      console.error('❌ BajanamandaliService Error:', error);
      throw error;
    }
  }

  async getNewsDetails(
    newsId:string
  ):Promise<NewsDetailsResponse>{

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
          newsId:newsId
        }

      });

    const parsed =

      typeof response.data === 'string'
      ? JSON.parse(response.data)
      : response.data;

    return parsed as
      NewsDetailsResponse;

  }

}


