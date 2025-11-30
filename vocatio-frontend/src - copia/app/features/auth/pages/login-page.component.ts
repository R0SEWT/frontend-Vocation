import { ChangeDetectorRef, Component, inject } from '@angular/core'; // para que salga el validando zoneless

import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { LoginPayload } from '../../../core/validators/models/auth.models';
import { authCardStyles } from '../../../shared/components/auth-card.styles';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
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
            @if (credentials.controls.email.touched && credentials.controls.email.hasError('required')) {
              <small
                class="field-error"
                >
                El email es requerido.
              </small>
            }
            @if (credentials.controls.email.touched && credentials.controls.email.hasError('email')) {
              <small
                class="field-error"
                >
                Ingresa un correo válido.
              </small>
            }
          </label>
    
          <label class="field">
            <span>Contraseña</span>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.invalid]="credentials.controls.password.invalid && credentials.controls.password.touched"
              />
              @if (credentials.controls.password.touched && credentials.controls.password.hasError('required')) {
                <small
                  class="field-error"
                  >
                  La contraseña es requerida.
                </small>
              }
              @if (credentials.controls.password.touched && credentials.controls.password.hasError('minlength')) {
                <small
                  class="field-error"
                  >
                  Mínimo 6 caracteres.
                </small>
              }
            </label>
    
            <label class="field">
              <div class="checkbox-row">
                <input type="checkbox" formControlName="rememberMe" id="rememberMe" />
                <label for="rememberMe">Mantener sesión activa</label>
              </div>
            </label>
    
            <button
              class="primary-action"
              type="submit"
              [disabled]="credentials.invalid || loading"
              [class.loading]="loading"
              [attr.aria-busy]="loading"
              >
              @if (loading) {
                <span class="loading-indicator" aria-hidden="true"></span>
              }
              <span class="label">{{ loading ? 'Validando...' : 'Entrar' }}</span>
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
  private readonly cdr = inject(ChangeDetectorRef);

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

    this.authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.success = true;
          this.feedback = response.message;
          this.session.saveTokens(response.tokens);
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.success = false;
          const message = this.extractErrorMessage(error);
          this.feedback = message;
          if (error.status === 401) {
            this.router.navigate(['/auth/invalid-credentials'], {
              state: { message }
            });
          }
        }
      });
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const body = error.error as { message?: string } | null;
    return body?.message ?? error.message ?? 'Ocurrió un error inesperado';
  }
}
