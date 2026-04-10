import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse, CreateOrderRequest, UpdateOrderRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiPath = '/Orders';

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiPath);
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiPath}/${id}`);
  }

  getOrdersByUserId(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiPath}/user/${userId}`);
  }

  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiPath, request);
  }

  updateOrder(id: number, request: UpdateOrderRequest): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiPath}/${id}`, request);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
