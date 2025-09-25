import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export interface NityaPoojaModel {
  status: string;
  errorCode: string;
  imageUrl: string;
  message: string;
  result: {
    title: string;
    smallDescription: string;
    description: string;
    image: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class Nityapooja {
  constructor(private http: HttpClient) {}

  getActivityById(activityId: string = '29'): Observable<NityaPoojaModel> {
    const formData = new FormData();
    formData.append('activitiesId', activityId);

    const url = '/api/activities/info'; // proxy-config లో defined
    return this.http.post<NityaPoojaModel>(url, formData);
  }
}
