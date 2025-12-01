import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.session.getAccessToken();
    if (!token || req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const authenticated = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authenticated);
  }
}
