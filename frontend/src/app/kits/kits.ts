import { Component } from '@angular/core';
import { Api } from '../api';

@Component({
  selector: 'app-kits',
  imports: [],
  templateUrl: './kits.html',
  styleUrl: './kits.css',
})
export class Kits {
  constructor(private api : Api) {}
  grade: any
  models: any
  ngAfterContentInit() {
    this.grade = "EG";
    this.api.getModels(this.grade, 0, 8).subscribe({
      next: (res: any) => {
        this.models = res;
      }
    })
  }
}
