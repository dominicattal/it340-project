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
  otpgen(user:any, email: any) {
    return this.http.post(
      `${environment.apiUrl}/otpgen`,
      {user, email}
    )
  }
  otpverify(user:any, otp: any) {
    return this.http.post(
      `${environment.apiUrl}/otpverify`,
      {user, otp}
    )
  }
  registerUser(username: any, email: any, password: any) {
    return this.http.post(
      `${environment.apiUrl}/register`,
      {username, email, password}
    )
  }
  loginUser(username: any, password: any) {
    return this.http.post(
      `${environment.apiUrl}/login`,
      {username, password}
    )
  }
  profileUser(username: any) {
    return this.http.post(
      `${environment.apiUrl}/profile`,
      {username}
    )
  }
}
