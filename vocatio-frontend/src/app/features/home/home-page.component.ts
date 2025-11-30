import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LearningResource } from '../../core/validators/models/learning.models';
import { ProfileService } from '../../core/services/profile.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { SessionService } from '../../core/services/session.service';
import { TestService } from '../../core/services/test.service';
import { extractAreaIds } from '../../core/constants/interest-area.constants';
import { homePageStyles } from './home-page.styles';
import { UserProfile } from '../../core/validators/models/profile.models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="home-shell">
      <section class="hero-section">
        <div class="hero-content">
          <p class="eyebrow">Descubre tu camino</p>
          <h1>Explora tus resultados <span class="highlight">vocacionales</span></h1>
          <p class="hero-subtitle">
            {{ profile?.email || 'Completa tu perfil' }} · {{ profile?.gradeLabel || 'Sin grado definido' }}
          </p>
          <div class="hero-actions">
            <button class="primary-action" (click)="takeVocationalTest()">Realizar test vocacional</button>
            
            @if (lastAssessmentId) {
              <button class="secondary-action" (click)="viewLastResult()">Ver último resultado</button>
            } @else {
              <button class="secondary-action" (click)="refreshRecommendations()">Actualizar recomendaciones</button>
            }
            
            <button class="secondary-action" (click)="logout()">Cerrar sesión</button>
          </div>
        </div>

        <div class="hero-visual">
          <div class="character-card analyst">INTJ</div>
          <div class="character-card diplomat">ENFP</div>
          <div class="character-card sentinel">ISTJ</div>
          <div class="character-card explorer">ESTP</div>
        </div>
      </section>

      @if (profile) {
        <section class="dashboard-grid">
          <article class="profile-card">
            <header class="card-header">
              <div>
                <p class="eyebrow">Tu Perfil</p>
                <h3>{{ profile.name || 'Nombre no definido' }}</h3>
              </div>
              <button class="icon-btn" (click)="logout()" title="Cerrar sesión">
                ⏻
              </button>
            </header>
            
            <div class="profile-body">
              <p><strong>Edad:</strong> {{ profile.age ?? '--' }} años</p>
              <p><strong>Grado:</strong> {{ profile.gradeLabel || 'No definido' }}</p>
              <p><strong>Intereses:</strong> {{ profile.interests.length ? profile.interests.join(', ') : 'Sin intereses' }}</p>
              
              <!-- Feedback global (fuera del modal) -->
              @if (profileFeedback && !editingProfile) {
                <p class="feedback-msg">{{ profileFeedback }}</p>
              }
            </div>

            <div class="card-actions">
              <button class="primary-action small" (click)="openProfileConfig()">Editar Perfil</button>
              <button class="text-action danger" (click)="deleteAccount()" [disabled]="deletingAccount">
                {{ deletingAccount ? 'Eliminando...' : 'Eliminar cuenta' }}
              </button>
            </div>

            @if (editingProfile) {
              <div class="edit-overlay">
                <form [formGroup]="profileConfigForm" (ngSubmit)="submitProfileConfig()" class="edit-form">
                  <div class="form-header">
                    <h4>Actualiza tu perfil</h4>
                    <button type="button" class="close-btn" (click)="cancelProfileConfig()" [disabled]="editStatus === 'saving'">✕</button>
                  </div>
                  
                  <label class="field">
                    <span>Edad estimada</span>
                    <input type="number" formControlName="age" min="14" placeholder="Ej: 18" />
                    @if (profileConfigForm.controls['age'].touched && profileConfigForm.controls['age'].hasError('required')) {
                      <small class="field-error">La edad es obligatoria.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Grado de estudio</span>
                    <input type="text" formControlName="grade" placeholder="Ej: superior_tecnica_2" />
                  </label>

                  <label class="field">
                    <span>Intereses</span>
                    <textarea formControlName="interests" placeholder="Separados por comas"></textarea>
                    @if (profileConfigForm.controls['interests'].touched && profileConfigForm.controls['interests'].hasError('required')) {
                      <small class="field-error">Agrega al menos un interés.</small>
                    }
                  </label>

                  <!-- Feedback dentro del modal -->
                  @if (editFeedback) {
                    <div class="modal-feedback" [class.error]="editStatus === 'error'" [class.success]="editStatus === 'success'">
                      {{ editFeedback }}
                    </div>
                  }

                  <div class="form-actions">
                    <button type="button" class="secondary-action" (click)="cancelProfileConfig()" [disabled]="editStatus === 'saving'">
                      Cancelar
                    </button>
                    
                    <button class="primary-action" type="submit" 
                            [disabled]="profileConfigForm.invalid || editStatus === 'saving' || editStatus === 'success'">
                      @switch (editStatus) {
                        @case ('saving') { Guardando... }
                        @case ('success') { ¡Guardado! }
                        @default { Guardar }
                      }
                    </button>
                  </div>
                </form>
              </div>
            }
          </article>

          <article class="status-card">
            <p class="eyebrow">Estado Actual</p>
            <div class="status-content">
              <div class="status-item">
                <span class="status-value">{{ profile.interests.length }}</span>
                <span class="status-label">Intereses detectados</span>
              </div>
              <div class="status-message">
                <p>{{ recommendationMessage }}</p>
              </div>
            </div>
          </article>
        </section>
      }

      <section class="recommendations-section">
        <header class="section-header">
          <h2>Recursos Recomendados</h2>
          <p class="subtitle">Material seleccionado según tus intereses vocacionales.</p>
        </header>

        @if (statusMessage && !loadingResources && !resources.length) {
          <p class="feedback">{{ statusMessage }}</p>
        }

        @if (loadingResources) {
          <div class="loading-state">Cargando recursos...</div>
        }

        <div class="resource-grid">
          @for (resource of resources; track resource.id) {
            <article class="resource-card">
              <div class="resource-icon">📚</div>
              <div class="resource-info">
                <h4>{{ resource.title }}</h4>
                <p>{{ resource.description || 'Guía práctica para seguir avanzando.' }}</p>
                @if (resource.areaInteresId) {
                  <small>Área ID: {{ resource.areaInteresId }}</small>
                }
              </div>
            </article>
          } @empty {
            @if (!loadingResources && !statusMessage) {
              <div class="empty-state">
                <p>Aún no hay recomendaciones disponibles.</p>
              </div>
            }
          }
        </div>
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
  // Estados específicos para el modal de edición
  editStatus: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  editFeedback = '';
  
  deletingAccount = false;
  
  lastAssessmentId?: string;

  constructor(
    private profileService: ProfileService,
    private recommendationService: RecommendationService,
    private session: SessionService,
    private testService: TestService,
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
    this.checkAssessments();
  }

  private checkAssessments(): void {
    const token = this.session.getAccessToken();
    if (!token) return;

    this.testService.listAssessments(token).subscribe({
      next: (assessments) => {
        const completed = assessments.filter(a => a.status === 'COMPLETED');
        if (completed.length > 0) {
          this.lastAssessmentId = completed[completed.length - 1].id;
        }
      },
      error: (err) => console.error('Error verificando historial de tests', err)
    });
  }

  viewLastResult(): void {
    if (this.lastAssessmentId) {
      this.router.navigate(['/test/results', this.lastAssessmentId]);
    }
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
    // Resetear estados visuales
    this.editStatus = 'idle';
    this.editFeedback = '';
    this.profileFeedback = '';
    this.profileConfigForm.enable();
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
      this.editStatus = 'error';
      this.editFeedback = 'Agrega al menos un interés válido.';
      return;
    }

    // Iniciar proceso de guardado
    this.editStatus = 'saving';
    this.editFeedback = '';
    this.profileConfigForm.disable(); // Bloquear inputs

    this.profileService
      .updateProfile({
        age,
        grade: gradeValue,
        interests: normalizedInterests
      })
      .subscribe({
        next: (response) => {
          this.profile = response.profile;
          
          // Mostrar éxito visualmente
          this.editStatus = 'success';
          this.editFeedback = '¡Perfil actualizado correctamente!';
          
          this.syncProfileForm();
          
          // Actualizar recomendaciones en segundo plano
          const areaIds = extractAreaIds(this.profile.interests);
          if (areaIds) {
            this.recommendationMessage = 'Tus intereses ya alimentan recomendaciones específicas.';
            this.fetchRecommendations(areaIds);
          } else {
            this.recommendationMessage = 'Actualiza tus intereses para afinar el mapa vocacional.';
          }

          // Cierre automático retardado
          setTimeout(() => {
            this.editingProfile = false;
            this.profileConfigForm.enable();
            this.editStatus = 'idle';
            this.editFeedback = '';
          }, 1500);
        },
        error: (error: Error) => {
          this.editStatus = 'error';
          this.editFeedback = error.message || 'Error al guardar los cambios.';
          this.profileConfigForm.enable(); // Re-habilitar formulario para corregir
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