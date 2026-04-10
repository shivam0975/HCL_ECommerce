import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order';
import { OrderItemService } from '../../../core/services/order-item';
import { OrderResponse, OrderItemResponse } from '../../../shared/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private orderItemService = inject(OrderItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order = signal<OrderResponse | null>(null);
  items = signal<OrderItemResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const orderId = params['id'];
      if (orderId) {
        this.loadOrderDetail(+orderId);
      } else {
        this.error.set('Order ID not provided');
        this.loading.set(false);
      }
    });
  }

  loadOrderDetail(orderId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loadOrderItems(orderId);
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.error.set('Failed to load order details');
        this.loading.set(false);
      },
    });
  }

  loadOrderItems(orderId: number): void {
    this.orderItemService.getOrderItemsByOrderId(orderId).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading order items:', err);
        this.error.set('Failed to load order items');
        this.loading.set(false);
      },
    });
  }

  getStatusClass(status: string | null): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-unknown';
    }
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
