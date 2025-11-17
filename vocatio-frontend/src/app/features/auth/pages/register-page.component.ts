import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { RegisterPayload } from '../../../core/models/auth.models';
import { authCardStyles } from '../../../shared/components/auth-card.styles';
import { confirmPasswordValidator } from '../validators/confirm-password.validator';
import { getPasswordPolicyErrors } from '../../../core/validators/password-policy.validator';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
          <small *ngIf="registration.controls.fullName.touched && registration.controls.fullName.invalid" class="field-error">
            Indica tu nombre completo.
          </small>
        </label>

        <label class="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            formControlName="email"
            placeholder="correo@ejemplo.com"
            [class.invalid]="registration.controls.email.invalid && registration.controls.email.touched"
          />
          <small
            *ngIf="registration.controls.email.touched && registration.controls.email.hasError('required')"
            class="field-error"
          >
            El email es requerido.
          </small>
          <small
            *ngIf="registration.controls.email.touched && registration.controls.email.hasError('email')"
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
          <small *ngIf="registration.errors?.['passwordsMismatch']" class="field-error">
            Las contraseñas deben coincidir.
          </small>
        </label>

        <ul class="policy-list" *ngIf="passwordPolicyErrors.length">
          <li *ngFor="let policy of passwordPolicyErrors">{{ policy }}</li>
        </ul>

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

    this.authService.register(payload).subscribe({
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
