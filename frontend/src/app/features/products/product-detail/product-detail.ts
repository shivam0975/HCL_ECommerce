import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { ProductResponse } from '../../../shared/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product = signal<ProductResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  quantity = signal(1);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product details');
        this.loading.set(false);
      },
    });
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity());
      this.quantity.set(1);
    }
  }
}
