import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Api } from '../api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(private api : Api, 
    private cookieService : CookieService,
    private router : Router) {}
  username: any;
  email: any;
  phone: any;
  mobile: any;
  address: any;
  ngAfterContentInit() {
    if (!this.cookieService.get('isLoggedIn')) {
      this.router.navigate(['/home'])
    }
    const name = this.cookieService.get('username');
    this.api.profileUser(name).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res["found"]) {
          this.username = res["username"];
          this.email = res["email"];
          this.mobile = res["mobile"];
          this.phone = res["phone"];
          this.address = res["address"];
        }
      }
    })
  }
}
