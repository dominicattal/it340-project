import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test implements OnInit {
  message: any
  constructor(private api : Api) {}
  ngOnInit() {
    this.api.test().subscribe(data => {
            this.message = data;
        });
  }
  working(): any {
    console.warn('Test Button works!');
    console.log(this.message)
  }
  toggleDisabled(): any {
    const testButton = document.getElementById('testButton') as HTMLInputElement;
    testButton.disabled = !testButton.disabled;
    console.warn(testButton.disabled);
  }
}
