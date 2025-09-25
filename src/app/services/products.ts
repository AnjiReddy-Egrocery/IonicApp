import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Products {
    private baseUrl = '/api/Products';   // ✅ no trailing slash

  constructor(private http: HttpClient) {}

  getProductList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index`);  // ✅ only one slash
  }
}
