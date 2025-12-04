import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Api } from '../api';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
  providers: [CookieService]
})
export class Logout {
  constructor(private api : Api,
            private router : Router,
            private cookieService: CookieService) {}
  ngAfterViewInit() {
    this.cookieService.delete('loggedIn')
    this.cookieService.delete('username')
    this.router.navigate(['/home'])
  }
}
