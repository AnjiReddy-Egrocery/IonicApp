import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AyyappakrayakramamService {
    private baseUrl = '/api/activities/'; // proxy path

  constructor(private http: HttpClient) { }

  getKaryakaramamList(): Observable<any> {
     return this.http.get(`${this.baseUrl}/index`);
  }
}
