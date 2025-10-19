import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    this.http.get<{ status: string }>('/api/health').subscribe({
      next: (response) => {
        this.status.set(JSON.stringify(response));
        this.loading.set(false);
      },
      error: (error) => {
        this.status.set(`Error: ${error.message}`);
        this.loading.set(false);
      }
    });
  }

  pingDb(): void {
    this.loading.set(true);
    this.http.post<{ _id: string }>('/api/ping', {}).subscribe({
      next: (response) => {
        this.pingResult.set(JSON.stringify(response));
        this.loading.set(false);
      },
      error: (error) => {
        this.pingResult.set(`Error: ${error.message}`);
        this.loading.set(false);
      }
    });
  }
}
