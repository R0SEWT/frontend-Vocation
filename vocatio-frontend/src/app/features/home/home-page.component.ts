import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningResource } from '../../core/validators/models/learning.models';
import { ProfileService } from '../../core/services/profile.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { SessionService } from '../../core/services/session.service';
import { TestService } from '../../core/services/test.service';
import { extractAreaIds, INTEREST_AREA_CATALOG } from '../../core/constants/interest-area.constants';
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
            {{ profile?.name || profile?.email || 'Completa tu perfil' }} · {{ getGradeLabel(profile?.grade) || 'Sin grado definido' }}
          </p>
          
          <div class="hero-actions">
            <!-- Grupo de acciones principales -->
            <div class="button-group">
              <button class="primary-action" (click)="takeVocationalTest()">Realizar test vocacional</button>
              
              @if (hasCompletedAttempts) {
                <button class="secondary-action" (click)="toggleHistory()">
                  {{ showHistory ? 'Ocultar intentos' : 'Ver intentos anteriores' }}
                </button>
                <button class="secondary-action" (click)="viewLastResult()">Ver último resultado</button>
              } @else {
                <button class="secondary-action" (click)="refreshRecommendations()">Actualizar recomendaciones</button>
              }
            </div>
            
            <!-- Acción secundaria separada visualmente -->
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
                Salir
              </button>
            </header>
            
            <div class="profile-body">
              <p><strong>Nombre:</strong> {{ profile.name || 'No definido' }}</p>
              <p><strong>Edad:</strong> {{ profile.age ?? '--' }} años</p>
              <p><strong>Grado:</strong> {{ getGradeLabel(profile.grade) || 'No definido' }}</p>
              <p><strong>Intereses:</strong> {{ profile.interests.length ? profile.interests.join(', ') : 'Sin intereses' }}</p>
              
              <!-- Feedback global -->
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
                    <button type="button" class="close-btn" (click)="cancelProfileConfig()" [disabled]="editStatus === 'saving'">Cerrar</button>
                  </div>
                  
                  <label class="field">
                    <span>Nombre completo</span>
                    <input type="text" formControlName="fullName" placeholder="Tu nombre" />
                    @if (profileConfigForm.controls['fullName'].touched && profileConfigForm.controls['fullName'].hasError('required')) {
                      <small class="field-error">El nombre es obligatorio.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Edad estimada</span>
                    <input type="number" formControlName="age" min="14" placeholder="Ej: 18" />
                    @if (profileConfigForm.controls['age'].touched && profileConfigForm.controls['age'].hasError('required')) {
                      <small class="field-error">La edad es obligatoria.</small>
                    }
                  </label>

                  <!-- Selector de Grado -->
                  <label class="field">
                    <span>Grado de estudio</span>
                    <select formControlName="grade">
                      <option value="" disabled>Selecciona tu último grado aprobado</option>
                      @for (option of gradeOptions; track option.value) {
                        <option [value]="option.value">{{ option.label }}</option>
                      }
                    </select>
                    @if (profileConfigForm.controls['grade'].touched && profileConfigForm.controls['grade'].hasError('required')) {
                      <small class="field-error">Selecciona un grado.</small>
                    }
                  </label>

                  <!-- Lista de Intereses -->
                  <div class="field">
                    <span>Intereses</span>
                    <div class="interests-container">
                      @for (interest of interestOptions; track interest) {
                        <label class="checkbox-option">
                          <input type="checkbox" 
                                 [checked]="isInterestSelected(interest)" 
                                 (change)="toggleInterest(interest, $event)">
                          {{ interest }}
                        </label>
                      }
                    </div>
                    @if (profileConfigForm.controls['interests'].touched && profileConfigForm.controls['interests'].invalid) {
                      <small class="field-error">Selecciona al menos un interés.</small>
                    }
                  </div>

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

      @if (showHistory) {
        <section class="history-section">
          <header class="section-header">
            <h2>Intentos anteriores</h2>
            <p class="subtitle">Selecciona un resultado para ver o eliminar.</p>
          </header>

          @if (!completedAttempts.length) {
            <p class="feedback">sin intentos, realice uno nuevo</p>
          } @else {
            <div class="history-list">
              @for (attempt of completedAttempts; track attempt.id) {
                <div class="history-item">
                  <div class="history-info">
                    <span class="history-id">#{{ attempt.id }}</span>
                    <span class="history-date">{{ formatDate(attempt.completedAt) }}</span>
                  </div>
                  <div class="history-actions">
                    <button class="secondary-action small" (click)="openResult(attempt.id)">Ver</button>
                    <button class="secondary-action danger small" [disabled]="deletingIds[attempt.id]" (click)="deleteAttempt(attempt.id)">
                      {{ deletingIds[attempt.id] ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="empty-state"><p>sin intentos, realice uno nuevo</p></div>
              }
            </div>
          }
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
              <div class="resource-icon">Recurso</div>
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
  showHistory = false;
  completedAttempts: any[] = [];
  deletingIds: Record<string, boolean> = {};
  
  profileConfigForm: FormGroup;
  editingProfile = false;
  profileFeedback = '';
  editStatus: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  editFeedback = '';
  deletingAccount = false;
  lastAssessmentId?: string;
  get hasCompletedAttempts(): boolean { return this.completedAttempts.length > 0; }

  interestOptions: string[] = Object.keys(INTEREST_AREA_CATALOG);

  gradeOptions = [
    { value: 'SECUNDARIA_1', label: '1° de secundaria' },
    { value: 'SECUNDARIA_2', label: '2° de secundaria' },
    { value: 'SECUNDARIA_3', label: '3° de secundaria' },
    { value: 'SECUNDARIA_4', label: '4° de secundaria' },
    { value: 'SECUNDARIA_5', label: '5° de secundaria' },
    { value: 'SUPERIOR_TECNICA_1', label: '1° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_2', label: '2° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_3', label: '3° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_4', label: '4° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_5_MAS', label: '5° ciclo o más de instituto técnico' },
    { value: 'UNIVERSIDAD_1', label: '1° ciclo universitario' },
    { value: 'UNIVERSIDAD_2', label: '2° ciclo universitario' },
    { value: 'UNIVERSIDAD_3', label: '3° ciclo universitario' },
    { value: 'UNIVERSIDAD_4', label: '4° ciclo universitario' },
    { value: 'UNIVERSIDAD_5', label: '5° ciclo universitario' },
    { value: 'UNIVERSIDAD_6_MAS', label: '6° ciclo o más universitario' }
  ];

  constructor(
    private profileService: ProfileService,
    private recommendationService: RecommendationService,
    private session: SessionService,
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.profileConfigForm = this.fb.group({
      fullName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(14)]],
      grade: ['', Validators.required],
      interests: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.checkAssessments();
    // Reaccionar a solicitudes de refresco vía query params
    this.route.queryParamMap.subscribe(params => {
      if (params.has('refresh')) {
        console.log('Refrescando historial por query param refresh');
        this.checkAssessments();
      }
    });
  }

  getGradeLabel(value?: string): string {
    if (!value) return '';
    const option = this.gradeOptions.find(o => o.value === value);
    return option ? option.label : value;
  }

  private checkAssessments(): void {
    const token = this.session.getAccessToken();
    if (!token) return;

    this.testService.listAssessments(token).subscribe({
      next: (assessments) => {
        console.log('Todos los assessments:', assessments);
        console.log('Total de assessments recibidos:', assessments.length);
        
        const completed = assessments.filter(a => a.status === 'COMPLETED');
        console.log('Assessments completados:', completed);
        console.log('📈 Total completados:', completed.length);
        
        if (completed.length > 0) {
          // Mostrar IDs ANTES de ordenar
          console.log('IDs de completados (antes de ordenar):', completed.map(a => a.id));
          
          // Ordenar por ID descendente para obtener el más reciente
          const sorted = completed.sort((a, b) => Number(b.id) - Number(a.id));
          
          console.log('IDs de completados (después de ordenar):', sorted.map(a => a.id));
          console.log('El primero (más reciente) es:', sorted[0].id);
          
          this.lastAssessmentId = sorted[0].id;
          this.completedAttempts = sorted.map(a => ({ 
            id: a.id, 
            // Algunos backends no exponen completedAt en el resumen; usar fallback si no está
            completedAt: (a as any).completedAt ?? (a as any).updatedAt ?? undefined 
          }));
          console.log('lastAssessmentId asignado:', this.lastAssessmentId);
          // Limpiar cualquier mensaje anterior si hay intentos
          if (this.statusMessage?.includes('No hay intentos')) {
            this.statusMessage = '';
          }
          // Re-chequear brevemente para capturar nuevos intentos recién persistidos
          setTimeout(() => {
            // Evitar llamar si ya tenemos un ID establecido
            if (!this.lastAssessmentId) {
              console.log('Re-chequeo rápido de historial');
              this.checkAssessments();
            }
          }, 800);
        } else {
          console.log('No hay assessments completados');
          // Asegurar que el botón muestre "Actualizar recomendaciones" y no "Ver último resultado"
          this.lastAssessmentId = undefined;
          this.completedAttempts = [];
          // Mensaje claro para el usuario cuando no hay intentos
          this.statusMessage = 'sin intentos, realice uno nuevo';
        }
      },
      error: (err) => console.error('Error verificando historial', err)
    });
  }

  viewLastResult(): void {
    console.log('viewLastResult llamado. lastAssessmentId:', this.lastAssessmentId);
    console.log('Tipo de lastAssessmentId:', typeof this.lastAssessmentId);
    if (this.lastAssessmentId) {
      console.log('Navegando a /test/results/' + this.lastAssessmentId);
      console.log('Array de navegación:', ['/test/results', this.lastAssessmentId]);
      this.router.navigate(['/test/results', this.lastAssessmentId]);
    } else {
      console.error('No hay lastAssessmentId disponible');
      this.statusMessage = 'Aún cargando historial. Intenta nuevamente en unos segundos.';
      // Lanzar una recarga de historial inmediata
      this.checkAssessments();
    }
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  openResult(id: string): void {
    this.router.navigate(['/test/results', id]);
  }

  deleteAttempt(id: string): void {
    const confirmDelete = confirm('¿Eliminar este intento? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    const token = this.session.getAccessToken();
    if (!token) return;
    this.deletingIds = { ...this.deletingIds, [id]: true };
    this.testService.deleteAssessment(id, token).subscribe({
      next: () => {
        this.removeInsightsLocal(id);
        this.completedAttempts = this.completedAttempts.filter(a => a.id !== id);
        if (this.lastAssessmentId === id) {
          // Recalcular el último
          const nextLast = this.completedAttempts[0]?.id;
          this.lastAssessmentId = nextLast;
        }
        if (!this.completedAttempts.length) {
          this.statusMessage = 'sin intentos, realice uno nuevo';
        }
      },
      error: (err) => {
        console.error('Error eliminando intento', err);
      },
      complete: () => {
        const { [id]: _, ...rest } = this.deletingIds;
        this.deletingIds = rest;
      }
    });
  }

  private removeInsightsLocal(assessmentId: string): void {
    try {
      const key = `vocatio:insights:${assessmentId}`;
      localStorage.removeItem(key);
    } catch {}
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
    this.editStatus = 'idle';
    this.editFeedback = '';
    this.profileFeedback = '';
    this.profileConfigForm.enable();
    this.syncProfileForm();
  }

  cancelProfileConfig(): void {
    this.editingProfile = false;
  }

  goToHome(): void {
    this.editingProfile = false;
    this.router.navigate(['/']);
  }

  isInterestSelected(interest: string): boolean {
    const currentInterests = this.profileConfigForm.controls['interests'].value as string[] || [];
    return currentInterests.includes(interest);
  }

  toggleInterest(interest: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentInterests = this.profileConfigForm.controls['interests'].value as string[] || [];
    
    let newInterests: string[];
    if (isChecked) {
      newInterests = [...currentInterests, interest];
    } else {
      newInterests = currentInterests.filter(i => i !== interest);
    }

    this.profileConfigForm.patchValue({ interests: newInterests });
    this.profileConfigForm.controls['interests'].markAsTouched();
  }

  submitProfileConfig(): void {
    if (this.profileConfigForm.invalid) {
      this.profileConfigForm.markAllAsTouched();
      return;
    }

    const rawValue = this.profileConfigForm.getRawValue();
    
    const fullName = rawValue.fullName?.trim();
    const age = Number(rawValue.age); 
    const grade = (rawValue.grade ?? '').trim();
    const interests = rawValue.interests as string[] || [];

    if (!interests.length) {
      this.editStatus = 'error';
      this.editFeedback = 'Selecciona al menos un interés.';
      return;
    }

    this.editStatus = 'saving';
    this.editFeedback = '';
    this.profileConfigForm.disable();

    this.profileService
      .updateProfile({
        age,
        grade,
        interests
      })
      .subscribe({
        next: (response) => {
          if (fullName && fullName !== this.profile?.name) {
             this.updatePersonalData(fullName, response.profile);
          } else {
             this.finalizeUpdate(response.profile);
          }
        },
        error: (error: Error) => {
          this.handleUpdateError(error);
        }
      });
  }

  private updatePersonalData(newName: string, currentProfile: UserProfile): void {
    this.profileService.patchPersonalData({ 
      name: newName, 
      preferences: currentProfile.preferences || {} 
    }).subscribe({
      next: (response) => {
        this.finalizeUpdate(response.profile);
      },
      error: (error: Error) => {
        console.error('Error actualizando nombre:', error);
        this.finalizeUpdate(currentProfile, 'Perfil actualizado, pero hubo un error al guardar el nombre.');
      }
    });
  }

  private finalizeUpdate(profile: UserProfile, customMessage?: string): void {
    this.profile = profile;
    this.editStatus = 'success';
    this.editFeedback = customMessage || '¡Perfil actualizado correctamente!';
    this.syncProfileForm();
    
    const areaIds = extractAreaIds(this.profile.interests);
    if (areaIds) {
      this.recommendationMessage = 'Tus intereses ya alimentan recomendaciones específicas.';
      this.fetchRecommendations(areaIds);
    } else {
      this.recommendationMessage = 'Actualiza tus intereses para afinar el mapa vocacional.';
    }

    setTimeout(() => {
      this.editingProfile = false;
      this.profileConfigForm.enable();
      this.editStatus = 'idle';
      this.editFeedback = '';
    }, 1500);
  }

  private handleUpdateError(error: Error): void {
    this.editStatus = 'error';
    this.editFeedback = error.message || 'Error al guardar los cambios.';
    this.profileConfigForm.enable();
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
      fullName: this.profile?.name ?? '',
      age: this.profile?.age ?? null,
      grade: this.profile?.grade ?? '',
      interests: this.profile?.interests ?? []
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}