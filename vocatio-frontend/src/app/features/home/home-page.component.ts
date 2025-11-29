import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LearningResource } from '../../core/validators/models/learning.models';
import { ProfileService } from '../../core/services/profile.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { SessionService } from '../../core/services/session.service';
import { extractAreaIds } from '../../core/constants/interest-area.constants';
import { homePageStyles } from './home-page.styles';
import { UserProfile } from '../../core/validators/models/profile.models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="home-shell">
      <div class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow">Descubre tu camino</p>
          <h1>Explora tus resultados <span style="color: var(--diplomat-green)">vocacionales</span></h1>
          <p>
            {{ profile?.email || 'Completa tu perfil' }} · {{ profile?.gradeLabel || 'Sin grado definido' }}
          </p>
          <div class="hero-actions">
            <button class="primary-action" (click)="takeVocationalTest()">Realizar test vocacional</button>
            <button class="secondary-action" (click)="refreshRecommendations()">Actualizar recomendaciones</button>
            <button class="secondary-action" (click)="logout()">Cerrar sesión</button>
          </div>
        </div>
    
        <div class="characters">
          <div class="character-card analyst">INTJ</div>
          <div class="character-card diplomat">ENFP</div>
          <div class="character-card sentinel">ISTJ</div>
          <div class="character-card explorer">ESTP</div>
        </div>
    
        @if (profile) {
          <section class="profile-panel">
            <header class="profile-header">
              <p class="eyebrow">Perfil disponible</p>
              <h3>{{ profile.name || 'Nombre no definido' }}</h3>
              <p class="profile-email">{{ profile.email }}</p>
            </header>
            <div class="profile-meta">
              <p><strong>Edad estimada:</strong> {{ profile.age ?? 'Pendiente' }}</p>
              <p><strong>Grado actual:</strong> {{ profile.gradeLabel || 'Sin grado definido' }}</p>
              <p><strong>Intereses:</strong> {{ profile.interests.length ? profile.interests.join(', ') : 'Sin intereses registrados' }}</p>
              @if (profile.preferences) {
                <p>
                  <strong>Preferencias:</strong>
                  <span>Newsletter {{ profile.preferences['newsletter'] ? 'activada' : 'desactivada' }}</span>
                  ·
                  <span>Compartir perfil {{ profile.preferences['shareProfile'] ? 'sí' : 'no' }}</span>
                </p>
              }
            </div>
            <div class="profile-actions">
              <button class="primary-action" type="button" (click)="openProfileConfig()">Configurar perfil</button>
              <button
                type="button"
                class="secondary-action danger-action"
                (click)="deleteAccount()"
                [disabled]="deletingAccount"
                >
                {{ deletingAccount ? 'Eliminando...' : 'Eliminar cuenta' }}
              </button>
            </div>
            @if (profileFeedback) {
              <p class="profile-feedback">{{ profileFeedback }}</p>
            }
            @if (editingProfile) {
              <form
                class="profile-form"
                [formGroup]="profileConfigForm"
                (ngSubmit)="submitProfileConfig()"
                >
                <div class="form-header">
                  <h4>Actualiza tu perfil vocacional</h4>
                  <button type="button" class="ghost" (click)="cancelProfileConfig()" [disabled]="savingProfile">
                    Cancelar
                  </button>
                </div>
                <label class="field">
                  <span>Edad estimada</span>
                  <input
                    type="number"
                    formControlName="age"
                    min="14"
                    placeholder="Ej: 18"
                    />
                    @if (profileConfigForm.controls['age'].touched && profileConfigForm.controls['age'].hasError('required')) {
                      <small class="field-error">
                        La edad es obligatoria.
                      </small>
                    }
                    @if (profileConfigForm.controls['age'].touched && profileConfigForm.controls['age'].hasError('min')) {
                      <small class="field-error">
                        Ingresa una edad válida.
                      </small>
                    }
                  </label>
                  <label class="field">
                    <span>Grado de estudio</span>
                    <input
                      type="text"
                      formControlName="grade"
                      placeholder="Ej: superior_tecnica_2"
                      />
                      @if (profileConfigForm.controls['grade'].touched && profileConfigForm.controls['grade'].hasError('required')) {
                        <small class="field-error">
                          El grado es requerido.
                        </small>
                      }
                    </label>
                    <label class="field">
                      <span>Intereses</span>
                      <textarea
                        formControlName="interests"
                        placeholder="Separados por comas"
                      ></textarea>
                      @if (profileConfigForm.controls['interests'].touched && profileConfigForm.controls['interests'].hasError('required')) {
                        <small class="field-error">
                          Agrega al menos un interés.
                        </small>
                      }
                    </label>
                    <div class="form-actions">
                      <button class="primary-action" type="submit" [disabled]="profileConfigForm.invalid || savingProfile">
                        {{ savingProfile ? 'Guardando...' : 'Guardar cambios' }}
                      </button>
                    </div>
                  </form>
                }
              </section>
            }
          </div>
    
          @if (profile) {
            <div class="status-card">
              <h3>Estado del perfil</h3>
              <p>Edad estimada: {{ profile.age ?? '—' }}</p>
              <p>Intereses capturados: {{ profile.interests.length }}</p>
              <p>{{ recommendationMessage }}</p>
            </div>
          }
    
          <section style="margin-top: 4rem;">
            <header style="text-align: center; margin-bottom: 2rem;">
              <h2>Recursos alineados a tu prueba vocacional</h2>
              <p class="subtitle">La plataforma cruza tus intereses con materiales validados por expertos.</p>
            </header>
            @if (statusMessage && !loadingResources) {
              <p class="feedback" style="text-align: center;">{{ statusMessage }}</p>
            }
            <div class="resource-grid">
              @for (resource of resources; track resource) {
                <article class="resource-card">
                  <h4>{{ resource.title }}</h4>
                  <p>{{ resource.description || 'Guía práctica para seguir avanzando.' }}</p>
                  @if (resource.areaInteresId) {
                    <small>Área ID: {{ resource.areaInteresId }}</small>
                  }
                </article>
              }
            </div>
            @if (!resources.length && !loadingResources) {
              <p class="feedback" style="text-align: center;">Aún no hay recomendaciones disponibles.</p>
            }
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
  profileConfigForm: FormGroup;
  editingProfile = false;
  profileFeedback = '';
  savingProfile = false;
  deletingAccount = false;

  constructor(
    private profileService: ProfileService,
    private recommendationService: RecommendationService,
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileConfigForm = this.fb.group({
      age: [null, [Validators.required, Validators.min(14)]],
      grade: ['', Validators.required],
      interests: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.profileService.fetchProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.syncProfileForm();
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

  openProfileConfig(): void {
    this.editingProfile = true;
    this.profileFeedback = '';
    this.syncProfileForm();
  }

  cancelProfileConfig(): void {
    this.editingProfile = false;
  }

  submitProfileConfig(): void {
    if (this.profileConfigForm.invalid) {
      this.profileConfigForm.markAllAsTouched();
      return;
    }

    const { age, grade, interests } = this.profileConfigForm.value;
    const interestsValue = interests ?? '';
    const gradeValue = (grade ?? '').trim();
    const normalizedInterests = this.normalizeInterests(interestsValue);

    if (!normalizedInterests.length) {
      this.profileFeedback = 'Agrega al menos un interés válido.';
      return;
    }

    this.savingProfile = true;
    this.profileService
      .updateProfile({
        age,
        grade: gradeValue,
        interests: normalizedInterests
      })
      .subscribe({
        next: (response) => {
          this.profile = response.profile;
          this.profileFeedback = response.message ?? 'Perfil actualizado';
          this.editingProfile = false;
          this.statusMessage = '';
          this.syncProfileForm();
          const areaIds = extractAreaIds(this.profile.interests);
          if (areaIds) {
            this.recommendationMessage = 'Tus intereses ya alimentan recomendaciones específicas.';
            this.fetchRecommendations(areaIds);
          } else {
            this.recommendationMessage = 'Actualiza tus intereses para afinar el mapa vocacional.';
          }
        },
        error: (error: Error) => {
          this.profileFeedback = error.message;
        },
        complete: () => {
          this.savingProfile = false;
        }
      });
  }

  deleteAccount(): void {
    const confirmation = prompt("Escribe ELIMINAR para confirmar la eliminación irreversible de la cuenta.");
    if (!confirmation || confirmation.trim().toUpperCase() !== 'ELIMINAR') {
      this.profileFeedback = "Escribe 'ELIMINAR' para confirmar la eliminación.";
      return;
    }

    const currentPassword = prompt('Ingresa tu contraseña actual');
    if (!currentPassword?.trim()) {
      this.profileFeedback = 'La contraseña actual es obligatoria.';
      return;
    }

    this.deletingAccount = true;
    this.profileFeedback = '';
    this.profileService.deleteAccount({ confirmation: 'ELIMINAR', currentPassword }).subscribe({
      next: (response) => {
        this.profileFeedback = response.message;
        this.session.clearTokens();
        this.router.navigate(['/auth/login']);
      },
      error: (error: Error) => {
        this.profileFeedback = error.message;
      },
      complete: () => {
        this.deletingAccount = false;
      }
    });
  }

  private syncProfileForm(): void {
    this.profileConfigForm.patchValue({
      age: this.profile?.age ?? null,
      grade: this.profile?.grade ?? '',
      interests: (this.profile?.interests ?? []).join(', ')
    });
  }

  private normalizeInterests(raw: string): string[] {
    const normalized = raw
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean)
      .map((interest) => interest.replace(/\s+/g, ' '));
    const unique: string[] = [];
    normalized.forEach((interest) => {
      const exists = unique.some((item) => item.toLowerCase() === interest.toLowerCase());
      if (!exists) {
        unique.push(interest);
      }
    });
    return unique;
  }
}
