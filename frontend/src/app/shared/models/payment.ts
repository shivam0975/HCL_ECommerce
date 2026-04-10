export interface PaymentResponse {
  paymentId: number;
  orderId: number | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  paidAt: string | null;
}

export interface CreatePaymentRequest {
  orderId?: number;
  paymentMethod: string;
  paymentStatus: string;
}

export interface UpdatePaymentRequest {
  orderId?: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt?: string | null;
}
