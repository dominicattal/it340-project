import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-kits',
  imports: [],
  templateUrl: './kits.html',
  styleUrl: './kits.css',
})
export class Kits implements OnInit {
  constructor(private api: Api, private route: ActivatedRoute, private router: Router) {}
  grade: string = "EG";
  models: any;

  // Display names for grades
  gradeNames: { [key: string]: string } = {
    'EG': 'Entry Grade',
    'HG': 'High Grade', 
    'RG': 'Real Grade',
    'MG': 'Master Grade',
    'PG': 'Perfect Grade'
  };

  // Kit counts for each grade
  kitCounts: { [key: string]: number } = {
    'EG': 98,
    'HG': 762,
    'RG': 58,
    'MG': 193,
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
    const limits = { 'EG': 98, 'HG': 762, 'RG': 58, 'MG': 193, 'PG': 26 };
    const limit = limits[this.grade as keyof typeof limits] || 100;

    this.api.getModels(this.grade, 0, limit).subscribe({
      next: (res: any) => {
        this.models = res;
      }
    });
  }

  setGrade(grade: string) {
    this.router.navigate(['/kits'], { queryParams: { grade: grade } });
  }
}
