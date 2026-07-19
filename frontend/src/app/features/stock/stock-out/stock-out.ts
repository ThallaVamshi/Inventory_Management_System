import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StockService } from '../../../core/services/stock';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-stock-out',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './stock-out.html',
  styleUrl: './stock-out.scss'
})
export class StockOut implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private productService = inject(ProductService);
  private router = inject(Router);

  loading = false;
  products: any[] = [];

  stockOutForm = this.fb.group({
    product: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    remarks: ['']
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (res) => this.products = res.data ?? []
    });
  }

  onSubmit() {
    if (this.stockOutForm.invalid) {
      this.stockOutForm.markAllAsTouched();
      return;
    }

    const selectedProductId = this.stockOutForm.value.product;
    const selectedProduct = this.products.find(p => p._id === selectedProductId);
    const quantityOut = this.stockOutForm.value.quantity ?? 1;

    if (selectedProduct && selectedProduct.availableQuantity < quantityOut) {
      alert(`Insufficient stock! Product only has ${selectedProduct.availableQuantity} available.`);
      return;
    }

    this.loading = true;
    this.stockService.stockOut(this.stockOutForm.value).subscribe({
      next: () => {
        alert('Stock-Out recorded successfully. Quantity dispatched.');
        this.router.navigate(['/stock/history']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to record stock-out');
        this.loading = false;
      }
    });
  }
}
