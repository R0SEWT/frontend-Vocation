import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { authLayoutStyles } from './auth-layout.styles';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">
      <main class="auth-shell">
        <section class="intro-panel">
          <div class="intro-content">
            <div class="brand">
              <span class="brand-mark">V</span>
              <div>
                <p class="eyebrow">Vocatio</p>
                <h1>El primer paso hacia tu carrera ideal</h1>
              </div>
            </div>
            <p class="intro-copy">Gestiona tus datos y realiza pruebas vocacionales guiadas.</p>
            <ul class="intro-list">
              <li>Regístrate con seguridad</li>
              <li>Protege tu información</li>
              <li>Accede a recomendaciones contextualizadas</li>
            </ul>
          </div>
        </section>
        <section class="auth-panel">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [authLayoutStyles]
})
export class AuthLayoutComponent {}
