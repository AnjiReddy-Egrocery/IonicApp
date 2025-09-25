import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Bajanamandali {
    private baseUrl = '/api/bajanamandali';   // ✅ no trailing slash

  constructor(private http: HttpClient) {}

  getBajamandaliList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index`);  // ✅ only one slash
  }
}
