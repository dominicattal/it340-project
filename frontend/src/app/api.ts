import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient) { }
  test() {
    return this.http.get(`${environment.apiUrl}/test`)
  }
}
