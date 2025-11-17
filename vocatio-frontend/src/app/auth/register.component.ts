import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { authFormStyles } from './auth-form.styles';


import { HttpClientModule } from '@angular/common/http';
import { Register } from '../services/register';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
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
            placeholder="Susy Diaz"
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
            placeholder="tiasusy1963@yopmail.com"
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
            placeholder="Digita tu contraseña"
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
            La contraseña debe tener al menos 8 caracteres.
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
    confirmPassword: '',
    rememberMe: false
  };

  protected feedback = '';
  protected success = false;

  constructor(private registerService: Register) {}



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

    if (this.registerData.password.length < 8) {
      this.feedback = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.feedback = 'Las contraseñas no coinciden.';
      return;
    }

    // Validar que la contraseña contenga al menos una letra mayúscula, una minúscula, un número 
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    //const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // osea no hay ps pero bueno la vida

    if (!uppercasePattern.test(this.registerData.password)) {
      this.feedback = 'La contraseña debe contener al menos una letra mayúscula.';
      return;
    }

    if (!lowercasePattern.test(this.registerData.password)) {
      this.feedback = 'La contraseña debe contener al menos una letra minúscula.';
      return;
    }

    if (!numberPattern.test(this.registerData.password)) {
      this.feedback = 'La contraseña debe contener al menos un número.';
      return;
    }


    // pasamos todas las validaciones
    this.success = true;

    this.registerService.postRegister({
      email: this.registerData.email,
      password: this.registerData.password,
      rememberMe: this.registerData.rememberMe
    }).subscribe({
      next: (res) => { 
        console.log('Respuesta del servidor (texto):', res);
        // mostrar el message de respuesta
        this.success = true;
        const res_dump = JSON.parse(res);
        this.feedback = res_dump.message;
      },
      
      error: (err) => {
        console.error('Error registro:', err);

        this.success = false;
        const err_dump = JSON.parse(err.error);
        this.feedback = err_dump.message;
      }
      
    });
  }
}
