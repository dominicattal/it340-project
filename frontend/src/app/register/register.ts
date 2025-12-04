import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

const generateHash = (string: string) => {
  let hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash.toString();
};

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [CookieService]
})
export class Register {
  constructor(private api : Api, 
    private cookieService : CookieService,
    private router : Router) {}
  name = ''
  pass = ''
  pass2 = ''
  output: any
  onSubmit() {
    if (this.pass != this.pass2) {
      this.output = "passwords dont match"
      return
    }
    this.api.registerUser(this.name, generateHash(this.pass)).subscribe({
      next: (res: any) => {
        console.log("response", res)
        if (res["created"]) {
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
