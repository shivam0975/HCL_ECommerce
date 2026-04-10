import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItemResponse, CreateOrderItemRequest, UpdateOrderItemRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private http = inject(HttpClient);
  private apiPath = '/OrderItems';

  getAllOrderItems(): Observable<OrderItemResponse[]> {
    return this.http.get<OrderItemResponse[]>(this.apiPath);
  }

  getOrderItemById(id: number): Observable<OrderItemResponse> {
    return this.http.get<OrderItemResponse>(`${this.apiPath}/${id}`);
  }

  getOrderItemsByOrderId(orderId: number): Observable<OrderItemResponse[]> {
    return this.http.get<OrderItemResponse[]>(`${this.apiPath}/order/${orderId}`);
  }

  createOrderItem(request: CreateOrderItemRequest): Observable<OrderItemResponse> {
    return this.http.post<OrderItemResponse>(this.apiPath, request);
  }

  updateOrderItem(id: number, request: UpdateOrderItemRequest): Observable<OrderItemResponse> {
    return this.http.put<OrderItemResponse>(`${this.apiPath}/${id}`, request);
  }

  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
