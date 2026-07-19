import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss'
})
export class SupplierList implements OnInit {
  private supplierService = inject(SupplierService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: any[] = [];
  loading = true;
  isAdmin = false;

  // Search and Pagination
  search = '';
  page = 1;
  limit = 5;
  totalPages = 1;
  totalSuppliers = 0;

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.isAdmin = user ? user.role === 'admin' : false;
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.loading = true;
    const params = {
      search: this.search,
      page: this.page,
      limit: this.limit
    };

    this.supplierService.getSuppliers(params).subscribe({
      next: (response: any) => {
        this.suppliers = response.data ?? [];
        this.totalPages = response.totalPages || 1;
        this.totalSuppliers = response.total || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.page = 1;
    this.loadSuppliers();
  }

  resetFilters() {
    this.search = '';
    this.page = 1;
    this.loadSuppliers();
  }

  setPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadSuppliers();
    }
  }

  deleteSupplier(id: string) {
    if (!this.isAdmin) {
      alert('Only administrators can delete suppliers.');
      return;
    }

    if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          alert('Supplier deleted successfully');
          this.loadSuppliers();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete supplier');
        }
      });
    }
  }
}
