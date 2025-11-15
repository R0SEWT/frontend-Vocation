import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { authFormStyles } from './auth-form.styles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-card">
      <p class="eyebrow">Ingreso</p>
      <h2>Bienvenido de nuevo</h2>
      <p class="subtitle">Introduce tus credenciales para acceder a tus oportunidades guardadas.</p>

      <form (ngSubmit)="handleLogin()" #loginForm="ngForm" novalidate>
        <label class="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            name="email"
            [(ngModel)]="credentials.email"
            #emailCtrl="ngModel"
            required
            autocomplete="email"
            placeholder="correo@ejemplo.com"
            [class.invalid]="loginForm.submitted && emailCtrl.invalid"
          />
          <small
            *ngIf="loginForm.submitted && emailCtrl.invalid"
            class="field-error"
          >
            Ingresa un correo válido.
          </small>
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            [(ngModel)]="credentials.password"
            #passwordCtrl="ngModel"
            required
            minlength="6"
            autocomplete="current-password"
            placeholder="••••••••"
          [class.invalid]="
            loginForm.submitted && (passwordCtrl.invalid || credentials.password.length < 6)
          "
        />
        <small
            *ngIf="
              loginForm.submitted && (passwordCtrl.invalid || credentials.password.length < 6)
            "
          class="field-error"
        >
          Utiliza al menos 6 caracteres.
          </small>
        </label>

        <button class="primary-action" type="submit">Entrar</button>
      </form>

      <p class="note">
        ¿Aún no tienes cuenta?
        <a routerLink="/register">Crea una ahora</a>
      </p>

      <p
        role="status"
        aria-live="polite"
        class="feedback"
        [class.success]="success"
        [class.error]="feedback && !success"
      >
        {{ feedback }}
      </p>
    </div>
  `,
  styles: [authFormStyles]
})
export class LoginComponent {
  protected credentials = {
    email: '',
    password: ''
  };

  protected feedback = '';
  protected success = false;

  protected handleLogin() {
    this.feedback = '';
    this.success = false;

    if (!this.credentials.email || !this.credentials.password) {
      this.feedback = 'Completa los campos obligatorios.';
      return;
    }

    if (this.credentials.password.length < 6) {
      this.feedback = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.success = true;
    this.feedback = 'Inicio de sesión simulado. ¡Bienvenido de nuevo!';
  }
}
