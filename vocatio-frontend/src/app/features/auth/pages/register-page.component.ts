import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { RegisterPayload } from '../../../core/validators/models/auth.models';
import { authCardStyles } from '../../../shared/components/auth-card.styles';
import { confirmPasswordValidator } from '../validators/confirm-password.validator';
import { getPasswordPolicyErrors } from '../../../core/validators/password-policy.validator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Registro</p>
      <h2>Empieza tu perfil</h2>
      <p class="subtitle">Activa tu cuenta para acceder a las pruebas vocacionales guiadas.</p>
    
      <form [formGroup]="registration" (ngSubmit)="onSubmit()">
        <label class="field">
          <span>Nombre completo</span>
          <input
            type="text"
            formControlName="fullName"
            placeholder="Tu nombre"
            [class.invalid]="registration.controls.fullName.invalid && registration.controls.fullName.touched"
            />
            @if (registration.controls.fullName.touched && registration.controls.fullName.invalid) {
              <small class="field-error">
                Indica tu nombre completo.
              </small>
            }
          </label>
    
          <label class="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              formControlName="email"
              placeholder="correo@ejemplo.com"
              [class.invalid]="registration.controls.email.invalid && registration.controls.email.touched"
              />
              @if (registration.controls.email.touched && registration.controls.email.hasError('required')) {
                <small
                  class="field-error"
                  >
                  El email es requerido.
                </small>
              }
              @if (registration.controls.email.touched && registration.controls.email.hasError('email')) {
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
                [class.invalid]="registration.controls.password.invalid && registration.controls.password.touched"
                />
              </label>
    
              <label class="field">
                <span>Confirmar contraseña</span>
                <input
                  type="password"
                  formControlName="confirmPassword"
                  placeholder="Repite la contraseña"
                  [class.invalid]="(registration.controls.confirmPassword.invalid && registration.controls.confirmPassword.touched) || registration.errors?.['passwordsMismatch']"
                  />
                  @if (registration.errors?.['passwordsMismatch']) {
                    <small class="field-error">
                      Las contraseñas deben coincidir.
                    </small>
                  }
                </label>
    
                @if (passwordPolicyErrors.length) {
                  <ul class="policy-list">
                    @for (policy of passwordPolicyErrors; track policy) {
                      <li>{{ policy }}</li>
                    }
                  </ul>
                }
    
                <label class="field">
                  <div class="checkbox-row">
                    <input type="checkbox" formControlName="rememberMe" id="rememberReg" />
                    <label for="rememberReg">Recordarme en este dispositivo</label>
                  </div>
                </label>
    
                <button
                  class="primary-action"
                  type="submit"
                  [disabled]="registration.invalid || loading || passwordPolicyErrors.length > 0"
                  >
                  {{ loading ? 'Registrando...' : 'Registrarme' }}
                </button>
              </form>
    
              <p class="note">
                ¿Ya tienes cuenta?
                <a routerLink="/auth/login">Ingresa aquí</a>
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
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  registration = this.fb.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rememberMe: [false]
    },
    { validators: confirmPasswordValidator }
  );

  feedback = '';
  success = false;
  loading = false;

  get passwordPolicyErrors(): string[] {
    return getPasswordPolicyErrors(this.registration.controls.password.value ?? '');
  }

  onSubmit(): void {
    if (this.registration.invalid || this.passwordPolicyErrors.length > 0) {
      this.registration.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.registration.value;
    const payload: RegisterPayload = {
      email: email ?? '',
      password: password ?? '',
      rememberMe: Boolean(rememberMe)
    };

    this.loading = true;
    this.feedback = '';

    this.authService
      .register(payload)
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
        error: (error: Error) => {
          this.success = false;
          this.feedback = error.message;
        }
      });
  }
}
