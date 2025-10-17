/// <reference types="google.maps" />
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environments/environment';


type AddressControl = 'pickupAddress' | 'dropoffAddress';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent implements OnInit, OnDestroy {
  @ViewChild('pickupInput') pickupInput?: ElementRef<HTMLInputElement>;
  @ViewChild('dropoffInput') dropoffInput?: ElementRef<HTMLInputElement>;

  orderForm = this.fb.group({
    pickupAddress: ['', Validators.required],
    dropoffAddress: ['', Validators.required],
    cylinderSize: [5, Validators.required],
    manufacturer: ['', Validators.required],
  });

  submissionMessage = '';
  errorMessage = '';
  submitting = false;

  readonly cylinderSizes = [
    { label: '2 kg cylinder', value: 2 },
    { label: '3 kg cylinder', value: 3 },
    { label: '5 kg cylinder', value: 5 },
    { label: '7 kg cylinder', value: 7 },
  ];

  private geocoder?: google.maps.Geocoder;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private mapLoader: MapLoaderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.mapLoader
      .load()
      .then(() => {
        this.geocoder = new google.maps.Geocoder();
        this.setupAutocomplete();
      })
      .catch((error) => {
        console.error(error);
        this.errorMessage = 'Google Maps failed to load. Please confirm your API key.';
      });
  }

  ngOnDestroy(): void {}

  private setupAutocomplete() {
    if (!this.pickupInput || !this.dropoffInput || !(window as any).google?.maps?.places) {
      return;
    }

    const pickupAutocomplete = new google.maps.places.Autocomplete(this.pickupInput.nativeElement, {
      componentRestrictions: { country: 'za' },
    });

    pickupAutocomplete.addListener('place_changed', () => {
      const place = pickupAutocomplete.getPlace();
      if (place.formatted_address) {
        this.orderForm.patchValue({ pickupAddress: place.formatted_address });
      }
    });

    const dropoffAutocomplete = new google.maps.places.Autocomplete(this.dropoffInput.nativeElement, {
      componentRestrictions: { country: 'za' },
    });

    dropoffAutocomplete.addListener('place_changed', () => {
      const place = dropoffAutocomplete.getPlace();
      if (place.formatted_address) {
        this.orderForm.patchValue({ dropoffAddress: place.formatted_address });
      }
    });
  }

  useMyLocation(target: AddressControl) {
    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation is not supported on this device.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!this.geocoder) {
          this.geocoder = new google.maps.Geocoder();
        }

        this.geocoder?.geocode(
          { location: { lat: position.coords.latitude, lng: position.coords.longitude } },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results?.length) {
              this.orderForm.patchValue({ [target]: results[0].formatted_address });
            } else {
              this.errorMessage = 'Unable to resolve your location. Please type your address.';
            }
          }
        );
      },
      () => {
        this.errorMessage = 'We could not access your location. Please allow location permissions.';
      }
    );
  }

  async submitOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all the required details.';
      return;
    }

    this.errorMessage = '';
    this.submissionMessage = '';
    this.submitting = true;

    try {
      const payload = this.orderForm.value;
      await firstValueFrom(
        this.ordersService.createOrder({
          pickupAddress: payload.pickupAddress!,
          dropoffAddress: payload.dropoffAddress!,
          cylinderSize: payload.cylinderSize!,
          manufacturer: payload.manufacturer!,
        })
      );

      this.submissionMessage = 'Order captured successfully! Launching secure payment…';

      const yocoSDK = await this.paymentService.loadYoco();
      const amountInCents = 1000;

      yocoSDK.showPopup({
        amountInCents,
        currency: 'ZAR',
        name: 'BasaGas LPG Refill',
        description: 'Secure payment via Yoco Checkout',
        publicKey: environment.yocoPublicKey,
        callback: (result: { error?: { message: string }; id?: string }) => {
          if (result.error) {
            this.errorMessage = result.error.message;
            this.submitting = false;
            return;
          }

          if (result.id) {
            this.paymentService.storeToken(result.id, amountInCents).subscribe({
              next: () => {
                this.submissionMessage = 'Payment token received. Operations will confirm delivery shortly!';
                this.submitting = false;
              },
              error: () => {
                this.errorMessage = 'We received your payment token but could not store it. Operations has been notified.';
                this.submitting = false;
              },
            });
          }
        },
        onClose: () => {
          this.submitting = false;
        },
      });
    } catch (error: any) {
      console.error(error);
      this.errorMessage = error?.message || 'Unable to submit your order right now.';
      this.submitting = false;
    }
  }
}
