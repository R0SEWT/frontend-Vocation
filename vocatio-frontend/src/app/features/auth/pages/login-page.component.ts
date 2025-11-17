import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { LoginPayload } from '../../../core/models/auth.models';
import { authCardStyles } from '../../../shared/components/auth-card.styles';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Ingreso</p>
      <h2>Bienvenido de nuevo</h2>
      <p class="subtitle">Introduce tus credenciales para continuar con tus exploraciones vocacionales.</p>

      <form [formGroup]="credentials" (ngSubmit)="onSubmit()">
        <label class="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            formControlName="email"
            placeholder="correo@ejemplo.com"
            [class.invalid]="credentials.controls.email.invalid && credentials.controls.email.touched"
          />
          <small
            *ngIf="credentials.controls.email.touched && credentials.controls.email.hasError('required')"
            class="field-error"
          >
            El email es requerido.
          </small>
          <small
            *ngIf="credentials.controls.email.touched && credentials.controls.email.hasError('email')"
            class="field-error"
          >
            Ingresa un correo válido.
          </small>
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input
            type="password"
            formControlName="password"
            placeholder="••••••••"
            [class.invalid]="credentials.controls.password.invalid && credentials.controls.password.touched"
          />
          <small
            *ngIf="credentials.controls.password.touched && credentials.controls.password.hasError('required')"
            class="field-error"
          >
            La contraseña es requerida.
          </small>
          <small
            *ngIf="credentials.controls.password.touched && credentials.controls.password.hasError('minlength')"
            class="field-error"
          >
            Mínimo 6 caracteres.
          </small>
        </label>

        <label class="field">
          <div class="checkbox-row">
            <input type="checkbox" formControlName="rememberMe" id="rememberMe" />
            <label for="rememberMe">Mantener sesión activa</label>
          </div>
        </label>

        <button class="primary-action" type="submit" [disabled]="credentials.invalid || loading">
          {{ loading ? 'Validando...' : 'Entrar' }}
        </button>
      </form>

      <p class="note">
        ¿Aún no tienes cuenta?
        <a routerLink="/auth/register">Crea una ahora</a>
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
    </section>
  `,
  styles: [authCardStyles]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  credentials = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  feedback = '';
  success = false;
  loading = false;

  onSubmit(): void {
    if (this.credentials.invalid) {
      this.credentials.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.credentials.value;
    const payload: LoginPayload = { email: email ?? '', password: password ?? '', rememberMe: Boolean(rememberMe) };
    this.loading = true;
    this.feedback = '';

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.success = true;
        this.feedback = response.message;
        this.session.saveTokens(response.tokens);
        this.router.navigate(['/home']);
      },
      error: (error: Error) => {
        this.success = false;
        this.feedback = error.message;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
