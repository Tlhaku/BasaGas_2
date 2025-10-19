import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) {}

  createOrder(payload: {
    pickupAddress: string;
    dropoffAddress: string;
    cylinderSize: number;
    manufacturer: string;
  }) {
    return this.http.post(`${environment.apiBaseUrl}/orders`, payload);
  }

  listOrders() {
    return this.http.get(`${environment.apiBaseUrl}/orders`);
  }
}
