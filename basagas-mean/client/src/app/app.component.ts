import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ApiHealthResponse {
  status: string;
}

interface PingResponse {
  _id: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected readonly status = signal<string>('');
  protected readonly pingResult = signal<string>('');
  protected readonly loading = signal<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  checkApi(): void {
    this.loading.set(true);
    this.http.get<ApiHealthResponse>('/api/health').subscribe({
      next: (response: ApiHealthResponse) => {
        this.status.set(JSON.stringify(response));
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.status.set(`Error: ${this.formatError(error)}`);
        this.loading.set(false);
      }
    });
  }

  pingDb(): void {
    this.loading.set(true);
    this.http.post<PingResponse>('/api/ping', {}).subscribe({
      next: (response: PingResponse) => {
        this.pingResult.set(JSON.stringify(response));
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.pingResult.set(`Error: ${this.formatError(error)}`);
        this.loading.set(false);
      }
    });
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    try {
      return JSON.stringify(error);
    } catch (stringifyError) {
      return `Unexpected error: ${String(stringifyError)}`;
    }
  }
}
