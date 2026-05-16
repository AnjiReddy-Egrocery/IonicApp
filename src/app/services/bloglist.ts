import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';

export interface BlogResponse {
  status: string;
  errorCode: string;
  message?: string;
  result?: any[];
}


@Injectable({
  providedIn: 'root'
})
export class Bloglist {
   private baseUrl = 'https://www.ayyappatelugu.com/APICalls/Blogs';

  constructor() {}

  // ✅ POST request without sending any parameters
  async getBlogList(): Promise<BlogResponse> {
    console.log('➡️ Calling Blog API...');

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
      return parsed as BlogResponse;
    } catch (error) {
      console.error('❌ BlogService Error:', error);
      throw error;
    }
  }
}

