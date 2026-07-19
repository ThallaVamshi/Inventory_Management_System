import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StockService } from '../../../core/services/stock';
import { ProductService } from '../../../core/services/product';
import { SupplierService } from '../../../core/services/supplier';

@Component({
  selector: 'app-stock-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './stock-in.html',
  styleUrl: './stock-in.scss'
})
export class StockIn implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  loading = false;
  products: any[] = [];
  suppliers: any[] = [];

  stockInForm = this.fb.group({
    product: ['', Validators.required],
    supplier: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    remarks: ['']
  });

  ngOnInit(): void {
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (res) => this.products = res.data ?? []
    });

    this.supplierService.getSuppliers({ limit: 100 }).subscribe({
      next: (res) => this.suppliers = res.data ?? []
    });
  }

  onSubmit() {
    if (this.stockInForm.invalid) {
      this.stockInForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.stockService.stockIn(this.stockInForm.value).subscribe({
      next: () => {
        alert('Stock-In recorded successfully. Available quantity updated.');
        this.router.navigate(['/stock/history']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to record stock-in');
        this.loading = false;
      }
    });
  }
}
