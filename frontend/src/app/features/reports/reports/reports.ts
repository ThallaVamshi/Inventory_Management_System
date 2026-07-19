import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  activeTab = 'sales';
  loading = false;
  today = new Date();

  // Report Data
  salesReport: any[] = [];
  valuationReport: any[] = [];
  valuationSummary: any = null;
  lowStockReport: any[] = [];
  purchasesReport: any[] = [];

  ngOnInit(): void {
    this.switchTab('sales');
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.loading = true;

    if (tab === 'sales') {
      this.reportService.getSalesReport().subscribe({
        next: (res) => {
          this.salesReport = res.data ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.handleError(err)
      });
    } else if (tab === 'valuation') {
      this.reportService.getInventoryReport().subscribe({
        next: (res) => {
          this.valuationReport = res.data ?? [];
          this.valuationSummary = res.summary ?? null;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.handleError(err)
      });
    } else if (tab === 'lowstock') {
      this.reportService.getLowStockReport().subscribe({
        next: (res) => {
          this.lowStockReport = res.data ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.handleError(err)
      });
    } else if (tab === 'purchases') {
      this.reportService.getSupplierPurchasesReport().subscribe({
        next: (res) => {
          this.purchasesReport = res.data ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  handleError(err: any) {
    console.error(err);
    alert('Failed to load report data.');
    this.loading = false;
    this.cdr.detectChanges();
  }

  getMonthName(monthNum: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || 'Unknown';
  }

  printReport() {
    window.print();
  }
}
