import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';
import { AddressService } from '../../../core/services/address';
import { AuthService } from '../../../core/services/auth';
import { AddressResponse, CreateOrderRequest } from '../../../shared/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  cartItems = this.cartService.items;
  addresses = signal<AddressResponse[]>([]);
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);
  currentStep = signal<'review' | 'address' | 'payment'>('review');

  checkoutForm = this.fb.group({
    addressId: ['', Validators.required],
    useNewAddress: [false],
  });

  addressForm = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    state: ['', [Validators.required, Validators.minLength(2)]],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
  });

  get cartTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
  }

  get totalItems(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.loadUserAddresses(user.userId);
  }

  loadUserAddresses(userId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.addressService.getAddressesByUserId(userId).subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        if (addresses.length > 0) {
          this.checkoutForm.patchValue({ addressId: addresses[0].addressId.toString() });
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
        this.loading.set(false);
      },
    });
  }

  nextStep(): void {
    const step = this.currentStep();
    if (step === 'review') {
      this.currentStep.set('address');
    } else if (step === 'address' && this.checkoutForm.valid) {
      this.currentStep.set('payment');
    }
  }

  prevStep(): void {
    const step = this.currentStep();
    if (step === 'address') {
      this.currentStep.set('review');
    } else if (step === 'payment') {
      this.currentStep.set('address');
    }
  }

  createOrder(): void {
    if (!this.checkoutForm.valid) {
      this.error.set('Please select an address');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      this.error.set('User information not available');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const orderRequest: CreateOrderRequest = {
      userId: user.userId,
      totalAmount: this.cartTotal,
      status: 'pending',
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.submitting.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/orders', order.orderId]);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.error.set('Failed to create order. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  continueShipping(): void {
    this.router.navigate(['/products']);
  }
}
