/// <reference types="google.maps" />

import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { TrackingService } from '../../services/tracking.service';
import { MapLoaderService } from '../../services/map-loader.service';

@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker],
  templateUrl: './track-page.component.html',
  styleUrl: './track-page.component.scss'
})
export class TrackPageComponent implements OnInit, OnDestroy {
  center = signal<google.maps.LatLngLiteral>({ lat: -26.2041, lng: 28.0473 });
  zoom = signal(12);
  mapLoaded = signal(false);
  deliverers = computed(() => this.trackingService.deliverers());

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    ],
  };

  constructor(private trackingService: TrackingService, private mapLoader: MapLoaderService) {}

  ngOnInit(): void {
    this.mapLoader
      .load()
      .then(() => {
        this.mapLoaded.set(true);
        this.trackingService.ensureSocketConnected();
        this.trackingService.fetchActiveDeliverers().subscribe((response) => {
          this.trackingService.deliverers.set(response.deliverers);
        });
      })
      .catch((err) => console.error('Failed to load map', err));
  }

  ngOnDestroy(): void {
    this.trackingService.disconnectSocket();
  }
}
