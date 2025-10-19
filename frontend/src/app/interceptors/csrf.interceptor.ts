import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from '../services/csrf.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfService);
  const token = csrfService.token();

  const headers = token
    ? {
        'X-CSRF-Token': token,
      }
    : {};

  return next(
    req.clone({
      setHeaders: headers,
    })
  );
};
