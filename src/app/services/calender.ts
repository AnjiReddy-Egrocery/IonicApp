import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class Calender { 

  constructor(private http: HttpClient) {}

  getCalendar(year: string): Observable<any> {
  const formData = new FormData();
  formData.append('year', year);
  return this.http.post('/api/calendar/index', formData);
}
}
