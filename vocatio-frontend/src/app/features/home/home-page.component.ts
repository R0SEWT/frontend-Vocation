import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LearningResource } from '../../core/models/learning.models';
import { ProfileService } from '../../core/services/profile.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { SessionService } from '../../core/services/session.service';
import { extractAreaIds } from '../../core/constants/interest-area.constants';
import { homePageStyles } from './home-page.styles';
import { UserProfile } from '../../core/models/profile.models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="home-shell">
      <div class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow">Panel principal</p>
          <h1>Explora tus resultados vocacionales</h1>
          <p>
            {{ profile?.email || 'Completa tu perfil' }} · {{ profile?.gradeLabel || 'Sin grado definido' }}
          </p>
          <div class="hero-actions">
            <button class="primary-action" (click)="refreshRecommendations()">Actualizar recomendaciones</button>
            <button class="secondary-action" (click)="takeVocationalTest()">Realizar test vocacional</button>
            <button class="secondary-action" (click)="logout()">Cerrar sesión</button>
          </div>
          <div class="status-card" *ngIf="profile">
            <h3>Estado del perfil</h3>
            <p>Edad estimada: {{ profile?.age ?? '—' }}</p>
            <p>Intereses capturados: {{ profile?.interests?.length || 0 }}</p>
            <p>{{ recommendationMessage }}</p>
          </div>
        </div>
      </div>

      <section>
        <header>
          <h2>Recursos alineados a tu prueba vocacional</h2>
          <p class="subtitle">La plataforma cruza tus intereses con materiales validados por expertos.</p>
        </header>
        <p class="feedback" *ngIf="statusMessage && !loadingResources">{{ statusMessage }}</p>
        <div class="resource-grid">
          <article class="resource-card" *ngFor="let resource of resources">
            <h4>{{ resource.title }}</h4>
            <p>{{ resource.description || 'Guía práctica para seguir avanzando.' }}</p>
            <small *ngIf="resource.areaInteresId">Área ID: {{ resource.areaInteresId }}</small>
          </article>
        </div>
        <p class="feedback" *ngIf="!resources.length && !loadingResources">Aún no hay recomendaciones disponibles.</p>
      </section>
    </main>
  `,
  styles: [homePageStyles]
})
export class HomePageComponent implements OnInit {
  profile?: UserProfile;
  resources: LearningResource[] = [];
  statusMessage = '';
  recommendationMessage = 'Actualiza tus intereses para afinar el mapa vocacional.';
  loadingResources = false;

  constructor(
    private profileService: ProfileService,
    private recommendationService: RecommendationService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.profileService.fetchProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.statusMessage = '';
        const areaIds = extractAreaIds(profile.interests);
        if (areaIds) {
          this.recommendationMessage = 'Tus intereses ya alimentan recomendaciones específicas.';
          this.fetchRecommendations(areaIds);
        } else {
          this.statusMessage = 'Añade al menos un interés para que el sistema sugiera rutas.';
        }
      },
      error: (error: Error) => {
        this.statusMessage = error.message;
      }
    });
  }

  private fetchRecommendations(areaIds: string): void {
    this.loadingResources = true;
    this.recommendationService.fetchByInterest(areaIds).subscribe({
      next: (response) => {
        this.resources = response.resources;
        if (!response.resources.length) {
          this.statusMessage = 'No hay recursos disponibles para los intereses seleccionados.';
        }
        this.loadingResources = false;
      },
      error: (error: Error) => {
        this.statusMessage = error.message;
        this.loadingResources = false;
      }
    });
  }

  refreshRecommendations(): void {
    if (!this.profile?.interests?.length) {
      this.statusMessage = 'Actualiza tus intereses antes de pedir recomendaciones.';
      return;
    }

    const areaIds = extractAreaIds(this.profile.interests);
    if (!areaIds) {
      this.statusMessage = 'Tus intereses no están asociados a una categoría conocida.';
      return;
    }

    this.statusMessage = '';
    this.fetchRecommendations(areaIds);
  }

  takeVocationalTest(): void {
    this.router.navigate(['/test']);
  }

  logout(): void {
    this.session.clearTokens();
    this.router.navigate(['/auth/login']);
  }
}
