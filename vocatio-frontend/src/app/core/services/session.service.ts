import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Tokens } from '../validators/models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  hasAccessToken(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    // 1. Si no hay token, no hay acceso.
    if (!token) {
      return false;
    }

    // 2. Si hay token, verificamos la fecha SOLO si existe.
    const expiry = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT);
    
    if (expiry) {
      // Si existe fecha, validamos que no haya pasado.
      const isExpired = new Date(expiry).getTime() <= Date.now();
      return !isExpired;
    }

    // 3. Si hay token pero no hay fecha (o se borró), asumimos que es válido.
    // Esto evita que el guard te bloquee por errores de formato.
    return true;
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

  // Ya no usamos este método en hasAccessToken para evitar la validación estricta,
  // pero lo dejamos por si lo necesitas en otra parte.
  private isExpired(key: string): boolean {
    const value = localStorage.getItem(key);
    if (!value) {
      return true;
    }
    const expiry = new Date(value);
    return expiry.getTime() <= Date.now();
  }
}