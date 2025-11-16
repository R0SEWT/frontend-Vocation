import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Register {

  private apiUrl = 'http://localhost:8080/auth/register';
  constructor(private http: HttpClient) {}

    /**
   * Envía los datos de registro al backend.
   * payload debe ser: { email, password, rememberMe }
   * Devuelve la respuesta del servidor como texto.
   */
    postRegister(payload: { email: string; password: string; rememberMe: boolean; }): Observable<string> {
    // Angular HttpClient añade Content-Type: application/json automáticamente
    // cuando pasamos un objeto como body.
    // Para recibir texto plano usamos responseType: 'text'.
    return this.http.post(this.apiUrl, payload, { responseType: 'text' as 'json' }) as Observable<string>;
  
}
}
