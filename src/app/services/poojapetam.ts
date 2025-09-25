import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Poojapetam {
private baseUrl = '/api/Decorators';   // ✅ no trailing slash

  constructor(private http: HttpClient) {}

  getDecoratorsList(): Observable<any> {
   return this.http.get(`${this.baseUrl}/index`);  // ✅ only one slash
  } 
}
