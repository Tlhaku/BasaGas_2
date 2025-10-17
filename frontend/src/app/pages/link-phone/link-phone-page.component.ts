import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService } from '../../services/tracking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-link-phone-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-phone-page.component.html',
  styleUrl: './link-phone-page.component.scss'
})
export class LinkPhonePageComponent implements OnDestroy {
  isBroadcasting = signal(false);
  statusMessage = signal('');
  private watchId: number | null = null;

  constructor(private trackingService: TrackingService, private authService: AuthService) {}

  startBroadcast() {
    if (this.authService.currentUser()?.role !== 'deliverer') {
      this.statusMessage.set('Only deliverer accounts can broadcast live locations.');
      return;
    }

    if (!navigator.geolocation) {
      this.statusMessage.set('Geolocation is not available on this device.');
      return;
    }

    this.trackingService.ensureSocketConnected();
    this.statusMessage.set('Starting live location broadcast…');
    this.isBroadcasting.set(true);

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.trackingService.broadcastLocation(position.coords.latitude, position.coords.longitude);
        this.statusMessage.set('Broadcasting live location. Keep this page open.');
      },
      (error) => {
        console.error(error);
        this.statusMessage.set('Unable to access your location. Please verify permissions.');
        this.stopBroadcast();
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }

  stopBroadcast() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isBroadcasting.set(false);
    this.statusMessage.set('Live broadcast stopped.');
    this.trackingService.disconnectSocket();
  }

  ngOnDestroy(): void {
    this.stopBroadcast();
  }
}
