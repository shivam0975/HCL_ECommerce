export interface OrderResponse {
  orderId: number;
  userId: number | null;
  totalAmount: number | null;
  status: string | null;
  createdAt: string | null;
}

export interface CreateOrderRequest {
  userId?: number;
  totalAmount?: number;
  status: string;
}

export interface UpdateOrderRequest {
  userId?: number;
  totalAmount?: number;
  status: string;
}
