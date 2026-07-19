import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ProductService } from '../product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  productId = '';
  loading = true;

  productForm = this.fb.group({
    productName: ['', Validators.required],
    sku: ['', Validators.required],
    category: ['', Validators.required],
    unitPrice: [0, Validators.required],
    unitOfMeasure: ['', Validators.required],
    reorderLevel: [0, Validators.required],
    availableQuantity: [0, Validators.required],
    description: ['']
  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      alert('Invalid Product ID');
      this.router.navigate(['/products']);
      return;
    }

    this.productId = id;

    this.loadProduct();
  }

  loadProduct(): void {

    console.log('Loading Product:', this.productId);

    this.productService
      .getProduct(this.productId)
      .pipe(
        finalize(() => {
          this.loading = false;
          console.log('Loading Finished');
        })
      )
      .subscribe({

        next: (response: any) => {

          console.log('API Response:', response);

          if (!response.success || !response.data) {
            alert('Product not found');
            this.router.navigate(['/products']);
            return;
          }

          this.productForm.patchValue({
            productName: response.data.productName,
            sku: response.data.sku,
            category: response.data.category,
            unitPrice: response.data.unitPrice,
            unitOfMeasure: response.data.unitOfMeasure,
            reorderLevel: response.data.reorderLevel,
            availableQuantity: response.data.availableQuantity,
            description: response.data.description
          });

        },

        error: (error) => {

          console.error(error);

          alert('Failed to load product');

          this.router.navigate(['/products']);

        }

      });

  }

  updateProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.productService
      .updateProduct(this.productId, this.productForm.value)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({

        next: () => {

          alert('Product Updated Successfully');

          this.router.navigate(['/products']);

        },

        error: (error) => {

          console.error(error);

          alert('Failed to update product');

        }

      });

  }

}