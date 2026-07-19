import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];
  loading = true;
  isAdmin = false;

  // Filters and search
  search = '';
  status = '';
  sort = '-createdAt';

  // Pagination
  page = 1;
  limit = 5;
  totalPages = 1;
  totalOrders = 0;

  // Status Options
  statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.isAdmin = user ? user.role === 'admin' : false;
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const params = {
      search: this.search,
      status: this.status,
      sort: this.sort,
      page: this.page,
      limit: this.limit
    };

    this.orderService.getOrders(params).subscribe({
      next: (response: any) => {
        this.orders = response.data ?? [];
        this.totalPages = response.totalPages || 1;
        this.totalOrders = response.totalOrders || 0;
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
    this.loadOrders();
  }

  resetFilters() {
    this.search = '';
    this.status = '';
    this.sort = '-createdAt';
    this.page = 1;
    this.loadOrders();
  }

  setPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadOrders();
    }
  }

  updateStatus(orderId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        alert('Order status updated successfully');
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to update order status');
        this.loadOrders(); // Reload to reset dropdown state to DB
      }
    });
  }

  deleteOrder(id: string) {
    if (!this.isAdmin) {
      alert('Only administrators can delete orders.');
      return;
    }

    if (confirm('Are you sure you want to delete this order? It will remove it permanently and adjust stock levels if not cancelled.')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          alert('Order deleted successfully');
          this.loadOrders();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete order');
        }
      });
    }
  }
}
