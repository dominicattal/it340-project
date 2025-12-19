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
      }
    })
  }
  removeBookmark(url: any) {
    var idx: any;
    this.api.bookmarkRemove(this.cookieService.get('username'), url).subscribe({
      next: (res: any) => {
        for (idx = 0; idx < this.models.length; idx++) {
          if (this.models[idx].url === url) {
            this.models.splice(idx, 1)
            break
          }
        }
      }
    });
  }
}
