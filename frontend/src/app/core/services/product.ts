import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse, CreateProductRequest, UpdateProductRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiPath = '/Product';

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiPath}/AllProducts`);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiPath}/${id}`);
  }

  createProduct(request: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiPath, request);
  }

  updateProduct(id: number, request: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiPath}/${id}`, request);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}
