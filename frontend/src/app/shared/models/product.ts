export interface ProductResponse {
  productId: number;
  name: string | null;
  description: string | null;
  price: number | null;
  stock: number | null;
  createdAt: string | null;
}

export interface CreateProductRequest {
  name: string;
  description?: string | null;
  price?: number;
  stock?: number;
}

export interface UpdateProductRequest {
  name: string;
  description?: string | null;
  price?: number;
  stock?: number;
}
