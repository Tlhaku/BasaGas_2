import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface DelivererLocation {
  user_id: string;
  username: string;
  lat: number;
  lng: number;
  updated: number;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private socket?: Socket;
  deliverers = signal<DelivererLocation[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}

  ensureSocketConnected() {
    if (this.socket || !this.auth.token) {
      return;
    }

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      auth: {
        token: this.auth.token,
      },
    });

    this.socket.on('active-deliverers', (data: DelivererLocation[]) => {
      this.deliverers.set(data);
    });

    this.socket.on('deliverer-location-update', (location: DelivererLocation) => {
      const existing = this.deliverers().filter((d) => d.user_id !== location.user_id);
      this.deliverers.set([...existing, location]);
    });

    this.socket.on('deliverer-offline', ({ user_id }: { user_id: string }) => {
      this.deliverers.set(this.deliverers().filter((d) => d.user_id !== user_id));
    });
  }

  disconnectSocket() {
    this.socket?.disconnect();
    this.socket = undefined;
    this.deliverers.set([]);
  }

  broadcastLocation(lat: number, lng: number) {
    this.ensureSocketConnected();
    this.socket?.emit('share-location', { lat, lng });
  }

  fetchActiveDeliverers() {
    return this.http.get<{ deliverers: DelivererLocation[] }>(`${environment.apiBaseUrl}/live-locations`);
  }
}
