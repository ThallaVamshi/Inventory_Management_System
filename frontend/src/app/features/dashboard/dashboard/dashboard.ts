import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  dashboardData: any = null;
  loading = true;
  userRole: string = '';

  // Modal Details State
  activeModal: 'products' | 'suppliers' | 'orders' | 'pendingOrders' | 'revenue' | 'lowStock' | null = null;
  modalTitle: string = '';
  modalData: any[] = [];
  modalLoading: boolean = false;
  modalSearchTerm: string = '';

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role || '';
      } catch (e) {}
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/dashboard`).subscribe({
      next: (res: any) => {
        this.dashboardData = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openDetailModal(type: 'products' | 'suppliers' | 'orders' | 'pendingOrders' | 'revenue' | 'lowStock') {
    this.activeModal = type;
    this.modalSearchTerm = '';
    this.modalData = [];
    this.modalLoading = true;
    this.cdr.detectChanges();

    if (type === 'products') {
      this.modalTitle = 'Product Details (All Products)';
      this.http.get(`${environment.apiUrl}/products?limit=100`).subscribe({
        next: (res: any) => {
          this.modalData = res.data || [];
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (type === 'lowStock') {
      this.modalTitle = 'Low Stock Items Details';
      this.http.get(`${environment.apiUrl}/products?lowStock=true&limit=100`).subscribe({
        next: (res: any) => {
          this.modalData = res.data || [];
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (type === 'suppliers') {
      this.modalTitle = 'Supplier Details (All Suppliers)';
      this.http.get(`${environment.apiUrl}/suppliers?limit=100`).subscribe({
        next: (res: any) => {
          this.modalData = res.data || [];
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (type === 'orders') {
      this.modalTitle = 'Customer Orders Details (All Orders)';
      this.http.get(`${environment.apiUrl}/orders?limit=100`).subscribe({
        next: (res: any) => {
          this.modalData = res.data || [];
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (type === 'pendingOrders') {
      this.modalTitle = 'Pending Orders Details';
      this.http.get(`${environment.apiUrl}/orders?limit=100`).subscribe({
        next: (res: any) => {
          const allOrders = res.data || [];
          this.modalData = allOrders.filter((o: any) => o.status === 'Pending');
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (type === 'revenue') {
      this.modalTitle = 'Total Revenue & Sales Breakdown';
      this.http.get(`${environment.apiUrl}/orders?limit=100`).subscribe({
        next: (res: any) => {
          const allOrders = res.data || [];
          this.modalData = allOrders.filter((o: any) => o.status !== 'Cancelled');
          this.modalLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.modalLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeDetailModal() {
    this.activeModal = null;
    this.modalData = [];
    this.cdr.detectChanges();
  }

  get filteredModalData() {
    if (!this.modalSearchTerm.trim()) {
      return this.modalData;
    }
    const term = this.modalSearchTerm.toLowerCase();
    return this.modalData.filter(item => {
      const json = JSON.stringify(item).toLowerCase();
      return json.includes(term);
    });
  }
}