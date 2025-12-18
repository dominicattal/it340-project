import { Component } from '@angular/core';
import { Api } from '../api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  imports: [],
  templateUrl: './bookmarks.html',
  styleUrl: './bookmarks.css',
})
export class Bookmarks {
  constructor(private api : Api, 
    private cookieService : CookieService,
    private router : Router) {}
  models: any;
  ngAfterContentInit() {
    if (!this.cookieService.get('loggedIn')) {
      this.router.navigate(['/home'])
    }
    const name = this.cookieService.get('username');
    this.api.bookmarkGetAll(name).subscribe({
      next: (res: any) => {
        this.models = res;
        console.log(this.models)
      }
    })
  }
}
