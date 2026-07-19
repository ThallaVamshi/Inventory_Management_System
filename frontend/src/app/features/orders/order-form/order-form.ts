import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss'
})
export class OrderForm implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);

  loading = false;
  products: any[] = [];

  // Computed Totals
  subtotal = 0;
  discountAmount = 0;
  taxAmount = 0;
  grandTotal = 0;

  orderForm = this.fb.group({
    customerName: ['', Validators.required],
    customerEmail: ['', [Validators.email]],
    customerPhone: ['', [Validators.pattern('^[0-9]{10}$')]],
    expectedDeliveryDate: ['', Validators.required],
    items: this.fb.array([], Validators.required)
  });

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.addItem(); // Start with one item line

    // Recalculate totals on form value changes
    this.orderForm.get('items')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  loadProducts() {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (res) => this.products = res.data ?? []
    });
  }

  createItemFormGroup() {
    return this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    } else {
      alert('An order must have at least one line item.');
    }
  }

  getProductPrice(productId: string): number {
    const p = this.products.find(prod => prod._id === productId);
    return p ? p.unitPrice : 0;
  }

  getProductSku(productId: string): string {
    const p = this.products.find(prod => prod._id === productId);
    return p ? p.sku : '';
  }

  getProductStock(productId: string): number {
    const p = this.products.find(prod => prod._id === productId);
    return p ? p.availableQuantity : 0;
  }

  calculateTotals() {
    let sub = 0;
    let disc = 0;

    this.items.controls.forEach(control => {
      const prodId = control.get('product')?.value;
      const qty = control.get('quantity')?.value ?? 0;
      const pct = control.get('discount')?.value ?? 0;

      if (prodId) {
        const price = this.getProductPrice(prodId);
        const lineTotal = price * qty;
        const lineDisc = (pct / 100) * lineTotal;

        sub += lineTotal;
        disc += lineDisc;
      }
    });

    const taxable = sub - disc;
    this.subtotal = sub;
    this.discountAmount = disc;
    this.taxAmount = parseFloat((taxable * 0.18).toFixed(2)); // 18% GST
    this.grandTotal = parseFloat((taxable + this.taxAmount).toFixed(2));
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    // Verify stock availability on client side first
    let stockValid = true;
    const itemsValue = this.items.value;
    for (const item of itemsValue) {
      const stock = this.getProductStock(item.product);
      if (stock < item.quantity) {
        const prod = this.products.find(p => p._id === item.product);
        alert(`Insufficient stock for ${prod?.productName || 'product'}. Available: ${stock}, Requested: ${item.quantity}`);
        stockValid = false;
        break;
      }
    }

    if (!stockValid) return;

    this.loading = true;
    this.orderService.createOrder(this.orderForm.value).subscribe({
      next: () => {
        alert('Order created successfully! Stock quantities updated.');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to create order');
        this.loading = false;
      }
    });
  }
}
