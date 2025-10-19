import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CsrfService } from './csrf.service';

export const csrfInitializer: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [HttpClient, CsrfService],
  useFactory: (http: HttpClient, csrfService: CsrfService) => {
    return () => {
      return firstValueFrom(
        http.get<{ csrfToken: string }>(`${environment.apiBaseUrl}/csrf-token`, {
          withCredentials: true,
        })
      ).then((response) => csrfService.token.set(response.csrfToken));
    };
  },
};
