import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list';
import { ProductDetailComponent } from './features/products/product-detail/product-detail';
import { CartComponent } from './features/cart/cart/cart';
import { OrderListComponent } from './features/orders/order-list/order-list';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ProfileComponent } from './features/profile/profile/profile';
import { CheckoutComponent } from './features/checkout/checkout/checkout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Product routes (public)
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  
  // Auth routes (public)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Shopping routes (public - cart is viewable, but checkout needs auth)
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  
  // Order routes (protected)
  { path: 'orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },
  
  // Profile route (protected)
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  
  // Catch-all route
  { path: '**', redirectTo: '/login' },
];
