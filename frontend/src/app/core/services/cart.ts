import { Injectable, signal, computed } from '@angular/core';
import { ProductResponse } from '../../shared/models';

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  items = this.cartItems.asReadonly();
  
  totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => 
      sum + (item.product.price || 0) * item.quantity, 0
    )
  );

  addToCart(product: ProductResponse, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.productId === product.productId);
    
    if (existingItem) {
      this.cartItems.update(items => 
        items.map(item => 
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      this.cartItems.update(items => [...items, { product, quantity }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => 
      items.filter(item => item.product.productId !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItems.update(items =>
      items.map(item =>
        item.product.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
