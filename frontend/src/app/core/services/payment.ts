import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentResponse, CreatePaymentRequest, UpdatePaymentRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiPath = '/Payment';

  getAllPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(this.apiPath);
  }

  getPaymentById(id: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiPath}/${id}`);
  }

  getPaymentsByOrderId(orderId: number): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiPath}/order/${orderId}`);
  }

  createPayment(request: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiPath, request);
  }

  updatePayment(id: number, request: UpdatePaymentRequest): Observable<PaymentResponse> {
    return this.http.put<PaymentResponse>(`${this.apiPath}/${id}`, request);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
