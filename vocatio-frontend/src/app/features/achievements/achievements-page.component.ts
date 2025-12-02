import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { achievementsPageStyles } from './achievements-page.styles';
import { uiStyles } from '../../shared/styles/ui.styles';

interface Achievement {
  title: string;
  description: string;
  unlockedAt?: string;
}

@Component({
  selector: 'app-achievements-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-shell">
      <header class="section-header">
        <div>
          <p class="eyebrow">Logros</p>
          <h2>Mis logros</h2>
        </div>
        <div>
          <button class="secondary-action" (click)="goHome()">Volver a inicio</button>
        </div>
      </header>

      <section class="card">
        <header class="card-header">
          <h3>Resumen</h3>
          <span class="badge">{{ achievements.length }} logros</span>
        </header>
        <div class="list">
          <div class="item" *ngFor="let a of achievements; trackBy: trackByTitle">
            <div>
              <strong>{{ a.title }}</strong>
              <p style="margin:4px 0 0; color:#4b5563;">{{ a.description }}</p>
            </div>
            <small class="badge" *ngIf="a.unlockedAt as d">Desbloqueado: {{ formatDate(d) }}</small>
          </div>
          <p *ngIf="!achievements.length" style="margin:0; color:#6b7280;">Aún no tienes logros. ¡Completa materiales y tests!</p>
        </div>
      </section>
    </main>
  `,
  styles: [uiStyles, achievementsPageStyles]
})
export class AchievementsPageComponent {
  achievements: Achievement[] = [];

  constructor(private router: Router) {}

  goHome(): void { this.router.navigate(['/home']); }

  trackByTitle = (_: number, a: Achievement) => a.title;

  formatDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
