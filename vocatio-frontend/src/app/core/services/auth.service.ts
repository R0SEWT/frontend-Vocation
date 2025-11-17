import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_ENDPOINTS, PROFILE_ENDPOINTS } from '../constants/api.constants';
import {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  ChangePasswordPayload,
  DeleteAccountPayload
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.register, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.login, payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(AUTH_ENDPOINTS.changePassword, payload);
  }

  deleteAccount(payload: DeleteAccountPayload): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(PROFILE_ENDPOINTS.me, { body: payload });
  }
}
