import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Api } from '../api';

const generateHash = (string: string) => {
  let hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash.toString();
};

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: []
})
export class Login {
constructor(private api : Api, 
    private cookieService : CookieService,
    private router : Router) {}
  name = ''
  pass = ''
  output: any
  onSubmit() {
    this.api.loginUser(this.name, generateHash(this.pass)).subscribe({
      next: (res: any) => {
        console.log("response", res)
        if (res["found"]) {
          this.cookieService.set('loggedIn', 'true')
          this.cookieService.set('username', this.name)
          this.router.navigate(['/home'])
        } else {
          this.output = res["message"]
        }
      }
    })
  }
}
