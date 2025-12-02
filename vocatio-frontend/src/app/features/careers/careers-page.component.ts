import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { uiStyles } from '../../shared/styles/ui.styles';
import { careersPageStyles } from './careers-page.styles';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/validators/models/profile.models';

interface CareerCard {
  name: string;
  duration: string; // Ej: "5 años" o "3 años"
  modality: string; // Presencial / Virtual / Mixta
  description: string;
  area?: string; // área sugerida
  formationType: 'técnica' | 'universitaria';
}

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="main-shell">
      <header class="section-header">
        <div>
          <p class="eyebrow">Carreras</p>
          <h2>Exploración de carreras y profesiones</h2>
        </div>
        <div>
          <button class="secondary-action" [routerLink]="['/home']">Volver a inicio</button>
        </div>
      </header>

      <section class="card">
        <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3>Fichas disponibles</h3>
          <span style="color:#6b7280">{{ filtered.length }} elementos</span>
        </header>

        <div style="display:grid; gap:8px; margin-bottom:12px;">
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:end;">
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Área</span>
              <select [(ngModel)]="areaFilter" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px; min-width:180px;">
                <option value="all">Todas</option>
                <option *ngFor="let a of areaOptions" [value]="a">{{ a }}</option>
              </select>
            </label>
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Modalidad</span>
              <select [(ngModel)]="modalityFilter" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px; min-width:160px;">
                <option value="all">Todas</option>
                <option *ngFor="let m of modalityOptions" [value]="m">{{ m }}</option>
              </select>
            </label>
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Tipo de formación</span>
              <select [(ngModel)]="formationFilter" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px; min-width:180px;">
                <option value="all">Todas</option>
                <option *ngFor="let t of formationOptions" [value]="t">{{ t }}</option>
              </select>
            </label>
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Duración</span>
              <select [(ngModel)]="durationFilter" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px; min-width:160px;">
                <option value="all">Todas</option>
                <option value="<=3">Hasta 3 años</option>
                <option value="4-5">4 a 5 años</option>
                <option value=">=6">6 o más</option>
              </select>
            </label>
            <label style="display:grid; gap:4px; min-width:200px; flex:1;">
              <span style="font-size:12px; color:#6b7280;">Buscar por nombre</span>
              <input type="text" [(ngModel)]="nameQuery" (keyup)="onFiltersChanged()" placeholder="Ej: Ingeniería" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;" />
            </label>
            <div style="display:flex; gap:8px;">
              <button class="secondary-action" type="button" (click)="clearFilters()">Limpiar</button>
            </div>
          </div>
        </div>
        <div class="grid">
          <article class="career" *ngFor="let c of filtered; trackBy: trackByName">
            <h4>{{ c.name }}</h4>
            <div class="meta">
              <span><strong>Duración:</strong> {{ c.duration }}</span>
              <span><strong>Modalidad:</strong> {{ c.modality }}</span>
              <span *ngIf="c.area"><strong>Área:</strong> {{ c.area }}</span>
              <span><strong>Formación:</strong> {{ c.formationType }}</span>
            </div>
            <p>{{ c.description }}</p>
            <div class="actions">
              <button class="primary-action" type="button" (click)="openDetail(c)">Ver detalle</button>
              <button class="secondary-action" type="button" (click)="toggleFavorite(c)">
                {{ isFavorite(c) ? 'Quitar de favoritos' : 'Marcar como favorita' }}
              </button>
            </div>
          </article>
          <p *ngIf="!filtered.length" style="margin:0; color:#6b7280;">No hay fichas que coincidan con los filtros.</p>
        </div>
      </section>

      <!-- Modal detalle -->
      <section class="modal-backdrop" *ngIf="detail" (click)="closeDetail($event)">
        <article class="modal-card" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <strong>{{ detail!.name }}</strong>
            <button class="close-btn" type="button" (click)="detail = undefined">Cerrar</button>
          </header>
          <div class="modal-body">
            <div class="meta">
              <span><strong>Duración:</strong> {{ detail!.duration }}</span>
              <span><strong>Modalidad:</strong> {{ detail!.modality }}</span>
              <span *ngIf="detail!.area"><strong>Área:</strong> {{ detail!.area }}</span>
              <span><strong>Formación:</strong> {{ detail!.formationType }}</span>
            </div>
            <p>{{ detail!.description }}</p>
            <div class="actions">
              <button class="primary-action" type="button" (click)="toggleFavorite(detail!)">
                {{ isFavorite(detail!) ? 'Quitar de favoritos' : 'Marcar como favorita' }}
              </button>
              <button class="secondary-action" type="button" (click)="detail = undefined">Cerrar</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  `,
  styles: [uiStyles, careersPageStyles]
})
export class CareersPageComponent implements OnInit {
  profile?: UserProfile;
  careers: CareerCard[] = [];
  detail?: CareerCard;
  // Filtros
  areaFilter: string = 'all';
  modalityFilter: string = 'all';
  nameQuery: string = '';
  areaOptions: string[] = ['Tecnología e Informática', 'Ciencias de la Salud', 'Negocios y Administración', 'Arte y Creatividad', 'Ingeniería', 'Ciencias Sociales'];
  modalityOptions: string[] = ['Presencial', 'Virtual', 'Mixta'];
  formationFilter: string = 'all';
  formationOptions: string[] = ['técnica', 'universitaria'];
  durationFilter: string = 'all';
  favorites: string[] = [];

  constructor(private router: Router, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.profileService.fetchProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loadCareersForProfile(p);
      },
      error: () => {
        this.loadCareersForProfile();
      }
    });
  }

  private loadCareersForProfile(p?: UserProfile): void {
    const interests = (p?.interests || []).map(i => i.toLowerCase());
    const base: CareerCard[] = [
      { name: 'Ingeniería de Sistemas', duration: '5 años', modality: 'Presencial', description: 'Formación en desarrollo de software, redes y arquitectura de sistemas.', area: 'Tecnología e Informática', formationType: 'universitaria' },
      { name: 'Medicina', duration: '7 años', modality: 'Presencial', description: 'Estudios enfocados en ciencias de la salud y atención médica.', area: 'Ciencias de la Salud', formationType: 'universitaria' },
      { name: 'Administración de Empresas', duration: '5 años', modality: 'Mixta', description: 'Gestión, finanzas y liderazgo organizacional.', area: 'Negocios y Administración', formationType: 'universitaria' },
      { name: 'Diseño Gráfico', duration: '3 años', modality: 'Virtual', description: 'Comunicación visual, branding y herramientas digitales.', area: 'Arte y Creatividad', formationType: 'técnica' },
      { name: 'Ingeniería Civil', duration: '5 años', modality: 'Presencial', description: 'Construcción, estructuras y gestión de proyectos.', area: 'Ingeniería', formationType: 'universitaria' },
      { name: 'Psicología', duration: '5 años', modality: 'Mixta', description: 'Comportamiento humano, evaluación y orientación.', area: 'Ciencias Sociales', formationType: 'universitaria' }
    ];

    if (!interests.length) {
      this.careers = base;
      return;
    }
    // Ordenar priorizando coincidencias por área
    this.careers = base.sort((a, b) => {
      const ai = interests.includes((a.area || '').toLowerCase()) ? 1 : 0;
      const bi = interests.includes((b.area || '').toLowerCase()) ? 1 : 0;
      return bi - ai;
    });
  }

  get filtered(): CareerCard[] {
    let list = [...this.careers];
    // Área
    if (this.areaFilter !== 'all') {
      list = list.filter(c => (c.area || '').toLowerCase() === this.areaFilter.toLowerCase());
    }
    // Modalidad
    if (this.modalityFilter !== 'all') {
      list = list.filter(c => (c.modality || '').toLowerCase() === this.modalityFilter.toLowerCase());
    }
    // Tipo de formación
    if (this.formationFilter !== 'all') {
      list = list.filter(c => (c.formationType || '').toLowerCase() === this.formationFilter.toLowerCase());
    }
    // Duración buckets
    if (this.durationFilter !== 'all') {
      const years = (c: CareerCard) => parseInt((c.duration || '0').replace(/[^0-9]/g, ''), 10) || 0;
      if (this.durationFilter === '<=3') list = list.filter(c => years(c) <= 3);
      else if (this.durationFilter === '4-5') list = list.filter(c => years(c) >= 4 && years(c) <= 5);
      else if (this.durationFilter === '>=6') list = list.filter(c => years(c) >= 6);
    }
    // Nombre contains
    const q = this.nameQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    return list;
  }

  onFiltersChanged(): void {}
  clearFilters(): void {
    this.areaFilter = 'all';
    this.modalityFilter = 'all';
    this.nameQuery = '';
    this.formationFilter = 'all';
    this.durationFilter = 'all';
  }

  openDetail(c: CareerCard): void { this.detail = c; }
  closeDetail(ev: Event): void { this.detail = undefined; }

  private favKey = 'vocatio:favorites:careers';
  private loadFavorites(): void {
    try {
      const raw = localStorage.getItem(this.favKey);
      this.favorites = raw ? JSON.parse(raw) : [];
    } catch { this.favorites = []; }
  }
  private saveFavorites(): void {
    try { localStorage.setItem(this.favKey, JSON.stringify(this.favorites)); } catch {}
  }
  isFavorite(c: CareerCard): boolean { return this.favorites.includes(c.name); }
  toggleFavorite(c: CareerCard): void {
    if (this.isFavorite(c)) {
      this.favorites = this.favorites.filter(n => n !== c.name);
    } else {
      this.favorites = [...this.favorites, c.name];
    }
    this.saveFavorites();
  }

  trackByName = (_: number, c: CareerCard) => c.name;
}
