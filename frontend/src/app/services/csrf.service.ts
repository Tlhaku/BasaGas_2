import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  token = signal<string>('');

  constructor(private http: HttpClient) {}

  loadToken() {
    return this.http
      .get<{ csrfToken: string }>(`${environment.apiBaseUrl}/csrf-token`, { withCredentials: true })
      .subscribe((response) => {
        this.token.set(response.csrfToken);
      });
  }
}
