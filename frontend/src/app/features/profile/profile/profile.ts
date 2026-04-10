import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';
import { UserResponse } from '../../../shared/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  user = signal<UserResponse | null>(this.authService.getCurrentUser());
  loading = signal(false);
  error = signal<string | null>(null);
  editMode = signal(false);

  ngOnInit(): void {
    if (this.user()) {
      this.loadUserProfile();
    }
  }

  loadUserProfile(): void {
    const user = this.user();
    if (!user?.userId) return;

    this.loading.set(true);
    this.error.set(null);

    this.userService.getUserById(user.userId).subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
  }

  logout(): void {
    this.authService.logout();
  }
}
