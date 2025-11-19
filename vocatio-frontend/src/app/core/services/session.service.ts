import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Tokens } from '../validators/models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  hasAccessToken(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return Boolean(token && !this.isExpired(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  saveTokens(tokens: Tokens): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, tokens.accessTokenExpiresAt);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, tokens.refreshTokenExpiresAt);
  }

  clearTokens(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  private isExpired(key: string): boolean {
    const value = localStorage.getItem(key);
    if (!value) {
      return true;
    }
    const expiry = new Date(value);
    return expiry.getTime() <= Date.now();
  }
}
