import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  loading = false;

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

  onSubmit() {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.productService.createProduct(this.productForm.value).subscribe({

      next: (response) => {

        console.log(response);

        alert('Product Added Successfully');

        this.router.navigate(['/products']);

      },

      error: (error) => {

        console.error(error);

        this.loading = false;

      }

    });

  }

}