import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: 'customer' | 'deliverer';
    phone?: string;
  };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'basagas_token';
  private readonly USER_KEY = 'basagas_user';

  currentUser = signal<AuthResponse['user'] | null>(this.loadStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  private loadStoredUser(): AuthResponse['user'] | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Unable to parse stored user', error);
      return null;
    }
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.persistSession(response);
      })
    );
  }

  register(payload: Record<string, unknown>) {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  private persistSession(response: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }
}
