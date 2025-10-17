import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { csrfInterceptor } from './app/interceptors/csrf.interceptor';
import { csrfInitializer } from './app/services/csrf-initializer';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([csrfInterceptor, authInterceptor])),
    provideAnimations(),
    importProvidersFrom(GoogleMapsModule),
    csrfInitializer
  ]
}).catch((err) => console.error(err));
