import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  loading = true;

  // Search and Filters
  search = '';
  category = '';
  lowStock = false;

  // Pagination
  page = 1;
  limit = 5;
  totalPages = 1;
  totalProducts = 0;

  isAdmin = false;

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.isAdmin = user ? user.role === 'admin' : false;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const params = {
      search: this.search,
      category: this.category,
      lowStock: this.lowStock ? 'true' : 'false',
      page: this.page,
      limit: this.limit
    };

    this.productService.getProducts(params).subscribe({
      next: (response: any) => {
        this.products = response.data ?? [];
        this.totalPages = response.totalPages || 1;
        this.totalProducts = response.totalProducts || 0;
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

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.search = '';
    this.category = '';
    this.lowStock = false;
    this.page = 1;
    this.loadProducts();
  }

  setPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadProducts();
    }
  }

  deleteProduct(id: string): void {
    if (!this.isAdmin) {
      alert('Only administrators can delete products.');
      return;
    }

    if (confirm('Are you sure you want to delete this product? This will permanently remove it from the system.')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete product');
        }
      });
    }
  }
}