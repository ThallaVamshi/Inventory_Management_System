import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  getSalesReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales`);
  }

  getInventoryReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory`);
  }

  getLowStockReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/low-stock`);
  }

  getSupplierPurchasesReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/purchases`);
  }

  getStockMovementsReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock`);
  }
}
