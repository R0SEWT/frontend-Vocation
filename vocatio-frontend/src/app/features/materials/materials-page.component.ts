import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { materialsPageStyles } from './materials-page.styles';
import { uiStyles } from '../../shared/styles/ui.styles';

interface MaterialItem {
  title: string;
  summary: string;
  type: 'video' | 'artículo' | 'recurso';
}

@Component({
  selector: 'app-materials-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-shell">
      <header class="section-header">
        <div>
          <p class="eyebrow">Materiales</p>
          <h2>Mis materiales</h2>
        </div>
        <div>
          <button class="secondary-action" (click)="goHome()">Volver a inicio</button>
        </div>
      </header>

      <section class="card">
        <header class="card-header">
          <h3>Recomendados para ti</h3>
          <span style="color:#6b7280">{{ materials.length }} elementos</span>
        </header>
        <div class="grid">
          <article class="tile" *ngFor="let m of materials; trackBy: trackByTitle">
            <h4>{{ m.title }}</h4>
            <p>{{ m.summary }}</p>
            <small style="color:#6b7280">Tipo: {{ m.type }}</small>
          </article>
          <p *ngIf="!materials.length" style="margin:0; color:#6b7280;">No hay materiales aún. Actualiza tus intereses o completa tests.</p>
        </div>
      </section>
    </main>
  `,
  styles: [uiStyles, materialsPageStyles]
})
export class MaterialsPageComponent {
  materials: MaterialItem[] = [];

  constructor(private router: Router) {}

  goHome(): void { this.router.navigate(['/home']); }

  trackByTitle = (_: number, m: MaterialItem) => m.title;
}
