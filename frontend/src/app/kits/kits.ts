import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../api';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

declare var bootstrap: any; // Declare Bootstrap

@Component({
  selector: 'app-kits',
  imports: [DatePipe],
  templateUrl: './kits.html',
  styleUrl: './kits.css',
})
export class Kits implements OnInit {
  constructor(private api: Api, private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {}
  grade: string = "EG";
  models: any;
  selectedModel: any = null;
  changed: any;

  // Display names for grades
  gradeNames: { [key: string]: string } = {
    'EG': 'Entry Grade',
    'HG': 'High Grade',
    'RG': 'Real Grade',
    'MG': 'Master Grade',
    'PG': 'Perfect Grade'
  };

  // Kit counts for each grade (updated based on combined data)
  kitCounts: { [key: string]: number } = {
    'EG': 98,
    'HG': 769,
    'RG': 61,
    'MG': 194,
    'PG': 26
  };

  getKitCount(grade: string): number {
    return this.kitCounts[grade] || 0;
  }

  get currentGradeName(): string {
    return this.gradeNames[this.grade] || this.grade;
  }

  ngOnInit() {
    // Read grade from query parameters
    this.route.queryParams.subscribe(params => {
      this.grade = params['grade'] || 'EG';
      this.loadKits();
    });
  }

  loadKits() {
    // Set limit based on grade (we know the counts)
    const limits = { 'EG': 98, 'HG': 769, 'RG': 61, 'MG': 194, 'PG': 26 };
    const limit = limits[this.grade as keyof typeof limits] || 100;

    this.api.getModels(this.cookieService.get('username'), this.grade, 0, limit).subscribe({
      next: (res: any) => {
        this.models = res;
      }
    });
  }

  setGrade(grade: string) {
    this.router.navigate(['/kits'], { queryParams: { grade: grade } });
  }

  showPriceComparison(model: any) {
    this.selectedModel = model;
    // Show Bootstrap modal
    const modalElement = document.getElementById('priceModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  bookmarkToggle(url: any, idx: any) {
    this.api.bookmarkToggle(this.cookieService.get('username'), url).subscribe({
      next: (res: any) => {
        this.models[idx].bookmarked = !this.models[idx].bookmarked;
        console.log(url, idx)
      }
    })
  }
}
