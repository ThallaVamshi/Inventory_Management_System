import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stock`;

  stockIn(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock-in`, data);
  }

  stockOut(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock-out`, data);
  }

  getStockHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }
}
