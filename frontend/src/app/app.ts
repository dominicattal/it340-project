import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [CookieService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private cookieService : CookieService) {}
  protected readonly title = signal('frontend');
  message: any
  isLoggedIn: any
  ngAfterContentChecked() {
    this.isLoggedIn = this.cookieService.get('loggedIn')
  }
}
