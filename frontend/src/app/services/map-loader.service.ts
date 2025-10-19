import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MapLoaderService {
  private loaderPromise?: Promise<void>;

  load(): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      return Promise.resolve();
    }

    if (!environment.googleMapsApiKey) {
      return Promise.reject(new Error('Google Maps API key is missing. Please set it in assets/env.js'));
    }

    if (!this.loaderPromise) {
      this.loaderPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.body.appendChild(script);
      });
    }

    return this.loaderPromise;
  }
}
