// frontend/src/app/core/auth/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SessionModalService } from './session-modal.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionModalService = inject(SessionModalService);
  const token = authService.getToken();

  const clonedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      // Si el servidor responde con 401 Unauthorized
      if (error.status === 401) {
        // Solo actuamos si todavía hay un token (evita múltiples ejecuciones en ráfaga)
        if (authService.getToken()) {
          authService.logout();
          sessionModalService.show();
        }
      }
      return throwError(() => error);
    })
  );
};