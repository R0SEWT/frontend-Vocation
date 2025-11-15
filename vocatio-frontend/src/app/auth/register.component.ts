import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { authFormStyles } from './auth-form.styles';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-card">
      <p class="eyebrow">Registro</p>
      <h2>Empieza tu perfil</h2>
      <p class="subtitle">Regístrate y encuentra tu carrera ideal.</p>

      <form (ngSubmit)="handleRegister()" #registerForm="ngForm" novalidate>
        <label class="field">
          <span>Nombre completo</span>
          <input
            type="text"
            name="fullName"
            [(ngModel)]="registerData.fullName"
            #fullNameCtrl="ngModel"
            required
            autocomplete="name"
            placeholder="María Torres"
            [class.invalid]="registerForm.submitted && fullNameCtrl.invalid"
          />
          <small *ngIf="registerForm.submitted && fullNameCtrl.invalid" class="field-error">
            Indica tu nombre completo.
          </small>
        </label>

        <label class="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            name="email"
            [(ngModel)]="registerData.email"
            #emailCtrl="ngModel"
            required
            autocomplete="email"
            placeholder="correo@yopmail.com"
            [class.invalid]="registerForm.submitted && emailCtrl.invalid"
          />
          <small *ngIf="registerForm.submitted && emailCtrl.invalid" class="field-error">
            Ingresa un correo válido.
          </small>
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            [(ngModel)]="registerData.password"
            #passwordCtrl="ngModel"
            required
            minlength="6"
            autocomplete="new-password"
            placeholder="Crea una contraseña"
            [class.invalid]="
              registerForm.submitted && (passwordCtrl.invalid || registerData.password.length < 6)
            "
          />
          <small
            *ngIf="
              registerForm.submitted && (passwordCtrl.invalid || registerData.password.length < 6)
            "
            class="field-error"
          >
            La contraseña debe tener al menos 6 caracteres.
          </small>
        </label>

        <label class="field">
          <span>Confirmar contraseña</span>
          <input
            type="password"
            name="confirmPassword"
            [(ngModel)]="registerData.confirmPassword"
            #confirmCtrl="ngModel"
            required
            autocomplete="new-password"
            placeholder="Repite la contraseña"
            [class.invalid]="
              registerForm.submitted && registerData.password !== registerData.confirmPassword
            "
          />
          <small
            *ngIf="
              registerForm.submitted && registerData.password !== registerData.confirmPassword
            "
            class="field-error"
          >
            Las contraseñas deben coincidir.
          </small>
        </label>

        <button class="primary-action" type="submit">Registrarme</button>
      </form>

      <p class="note">
        ¿Ya tienes cuenta?
        <a routerLink="/login">Ingresa aquí</a>
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
export class RegisterComponent {
  protected registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  protected feedback = '';
  protected success = false;

  protected handleRegister() {
    this.feedback = '';
    this.success = false;

    if (
      !this.registerData.fullName ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.confirmPassword
    ) {
      this.feedback = 'Completa todos los campos para continuar.';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.feedback = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.feedback = 'Las contraseñas no coinciden.';
      return;
    }

    this.success = true;
    this.feedback = 'Registro simulado completado. ¡Revisa tu correo para confirmar!';
  }
}
