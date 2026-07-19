import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  dashboardData: any = null;
  loading = true;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.http.get(`${environment.apiUrl}/dashboard`).subscribe({
      next: (res: any) => {
        console.log("Response:", res);

        this.dashboardData = res.data;
        this.loading = false;

        this.cdr.detectChanges();

        console.log("Loading:", this.loading);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}