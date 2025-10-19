import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    YocoSDK?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private yocoPromise?: Promise<any>;

  constructor(private http: HttpClient) {}

  loadYoco() {
    if (window.YocoSDK) {
      return Promise.resolve(window.YocoSDK);
    }

    if (!environment.yocoPublicKey) {
      return Promise.reject(new Error('Yoco public key is missing. Configure it in assets/env.js.'));
    }

    if (!this.yocoPromise) {
      this.yocoPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.async = true;
        script.onload = () => {
          if (window.YocoSDK) {
            resolve(window.YocoSDK);
          } else {
            reject(new Error('Yoco SDK failed to initialize'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Yoco SDK'));
        document.body.appendChild(script);
      });
    }

    return this.yocoPromise;
  }

  storeToken(token: string, amountInCents: number) {
    return this.http.post(`${environment.apiBaseUrl}/payments/yoco-token`, {
      token,
      amount: amountInCents,
    });
  }
}
