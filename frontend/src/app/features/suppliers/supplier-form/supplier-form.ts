import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../core/services/supplier';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss'
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = false;
  isEditMode = false;
  supplierId = '';

  supplierForm = this.fb.group({
    supplierName: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', Validators.required],
    gstNumber: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.supplierId = id;
      this.loadSupplier();
    }
  }

  loadSupplier() {
    this.loading = true;
    this.supplierService.getSupplier(this.supplierId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.supplierForm.patchValue({
            supplierName: response.data.supplierName,
            contactPerson: response.data.contactPerson,
            email: response.data.email,
            mobileNumber: response.data.mobileNumber,
            address: response.data.address,
            gstNumber: response.data.gstNumber
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load supplier details.');
        this.router.navigate(['/suppliers']);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data = this.supplierForm.value;

    if (this.isEditMode) {
      this.supplierService.updateSupplier(this.supplierId, data).subscribe({
        next: () => {
          alert('Supplier updated successfully');
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Failed to update supplier');
          this.loading = false;
        }
      });
    } else {
      this.supplierService.createSupplier(data).subscribe({
        next: () => {
          alert('Supplier created successfully');
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Failed to register supplier');
          this.loading = false;
        }
      });
    }
  }
}
