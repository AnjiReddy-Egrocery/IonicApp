import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Products {
    private baseUrl = '/api/Products';   // ✅ no trailing slash

  constructor(private http: HttpClient) {}

  getProductList(): Observable<any> {
    const url = `${this.baseUrl}/index`;

    // If your Postman request sends headers or body, add them here:
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Empty body if not required
    const body = {};

   return this.http.post(url, body, { headers });  // ✅ only one slash
  }
}
