import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);
  trackMenuOpen = signal(false);
  user = computed(() => this.auth.currentUser());

  constructor(private auth: AuthService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen.update((state) => !state);
  }

  toggleTrackMenu() {
    this.trackMenuOpen.update((state) => !state);
  }

  logout() {
    this.auth.logout();
    this.mobileMenuOpen.set(false);
  }
}
