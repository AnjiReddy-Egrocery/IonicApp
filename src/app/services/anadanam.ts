import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Anadanam {
     private baseUrl = '/api/annadhanams';   // ✅ no trailing slash

  constructor(private http: HttpClient) {}

  getMapList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index`);  // ✅ only one slash
  }
}
