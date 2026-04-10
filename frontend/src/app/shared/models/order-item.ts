export interface OrderItemResponse {
  orderItemId: number;
  orderId: number | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
}

export interface CreateOrderItemRequest {
  orderId?: number;
  productId?: number;
  quantity: number;
  price?: number;
}

export interface UpdateOrderItemRequest {
  orderId?: number;
  productId?: number;
  quantity?: number;
  price?: number;
}
