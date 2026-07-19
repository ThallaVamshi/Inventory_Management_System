import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService } from '../../../core/services/stock';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stock-history.html',
  styleUrl: './stock-history.scss'
})
export class StockHistory implements OnInit {
  private stockService = inject(StockService);
  private cdr = inject(ChangeDetectorRef);

  movements: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.stockService.getStockHistory().subscribe({
      next: (response: any) => {
        this.movements = response.data ?? [];
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
}
