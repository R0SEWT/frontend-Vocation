import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="home-shell">
      <section class="hero-section" id="hero-section">
        <div class="hero-content">
          <p class="eyebrow">Descubre tu camino</p>
          <h1>Explora tus resultados <span class="highlight">vocacionales</span></h1>
          <p class="hero-subtitle">
            {{ greeting }}, {{ profile?.name || profile?.email || 'Completa tu perfil' }} · {{ getGradeLabel(profile?.grade) || 'Sin grado definido' }}
          </p>
          
          <div class="hero-actions">
            <div class="button-group">
              @for (action of heroActions; track action.label) {
                <button [ngClass]="action.class" (click)="action.onClick()">{{ action.label }}</button>
              }
            </div>
          </div>
        </div>

        <div class="hero-visual">
          @for (card of heroCards; track card.label) {
            <div class="character-card" [ngClass]="card.class">{{ card.label }}</div>
          }
        </div>
      </section>

      <!-- Dashboard estilo tarjetas como el ejemplo -->
      <section class="recommended-tiles">
        <header class="section-header">
          <h2>Recomendaciones</h2>
        </header>
        <div class="resource-grid">
          @for (resource of resources.slice(0, 2); track resource.id) {
            <article class="resource-card large">
              <div class="resource-icon">Recurso</div>
              <div class="resource-info">
                <h4>{{ resource.title }}</h4>
                <p>{{ resource.description || 'Material sugerido' }}</p>
                <button class="secondary-action small" type="button">Detalles</button>
              </div>
            </article>
          } @empty {
            <div class="empty-state">
              <p>Aún no hay recomendaciones disponibles.</p>
            </div>
          }
          <article class="resource-card placeholder" title="Agregar">
            <div class="resource-icon">+</div>
          </article>
        </div>
      </section>

      <section class="dashboard-grid quick-cards">
        <article class="status-card streak-card">
          <p class="eyebrow">Racha</p>
          <div class="status-content">
            <div class="status-item">
              <span class="status-value">{{ streakDays }}</span>
              <span class="status-label">días</span>
            </div>
            <div class="status-actions">
              <button class="secondary-action small" type="button" (click)="viewAchievements()">Ver logros</button>
            </div>
          </div>
        </article>

        <article class="profile-card mini">
          <p class="eyebrow">Perfil</p>
          <div class="profile-body">
            <div class="avatar" style="width:64px;height:64px;border-radius:50%;background:#e5e7eb;margin:8px 0;"></div>
            <p>{{ profile?.name || profile?.email || 'Sin nombre' }}</p>
          </div>
          <div class="card-actions">
            <button class="secondary-action small" type="button" (click)="viewMaterials()">Ver materiales</button>
          </div>
        </article>

        <article class="status-card tests-card">
          <p class="eyebrow">Test realizados</p>
          <div class="tests-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
            <div class="gauge" [ngStyle]="gaugeStyle">
              <div class="gauge-center" [ngStyle]="gaugeCenterStyle">
                <div class="gauge-value" style="font-size:28px;font-weight:600;">{{ testsCompleted }}</div>
                <small>Objetivo: {{ testGoal }}</small>
              </div>
            </div>
            <div class="tests-cta" style="min-width:160px;">
              <p style="margin:0 0 8px 0;">Iniciar nuevo test</p>
              <button class="primary-action small" type="button" (click)="takeVocationalTest()">Iniciar</button>
            </div>
          </div>
        </article>
      </section>

      

      <!-- Historial embebido removido: usar página dedicada /history -->

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
  completedAttempts: any[] = [];
  // Historial embebido eliminado; usar página dedicada /history
  readonly testGoal = 30;
  streakDays = 0;
  heroCards = [
    { label: 'INTJ', class: 'analyst' },
    { label: 'ENFP', class: 'diplomat' },
    { label: 'ISTJ', class: 'sentinel' },
    { label: 'ESTP', class: 'explorer' }
  ];
  
  profileConfigForm: FormGroup;
  editingProfile = false;
  profileFeedback = '';
  editStatus: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  editFeedback = '';
  deletingAccount = false;
  lastAssessmentId?: string;
  viewingProfile = false; // Declare the viewingProfile boolean
  get hasCompletedAttempts(): boolean { return this.completedAttempts.length > 0; }
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
  get heroActions(): Array<{ label: string; class: string; onClick: () => void }> {
    if (!this.viewingProfile) {
      return [
        { label: 'Realizar test vocacional', class: 'primary-action', onClick: () => this.takeVocationalTest() },
        { label: 'Mi perfil', class: 'secondary-action', onClick: () => this.goToProfile() },
        { label: 'Historial', class: 'secondary-action', onClick: () => this.openHistory() }
      ];
    }
    return [
      { label: 'Ver últimos intentos', class: 'secondary-action', onClick: () => this.openHistory() },
      { label: 'Volver a inicio', class: 'secondary-action', onClick: () => this.goToHome() }
    ];
  }
  // Paginación local del historial eliminada
  get testsCompleted(): number { return this.completedAttempts.length; }
  get gaugePercent(): number {
    if (this.testGoal <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((this.testsCompleted / this.testGoal) * 100)));
  }
  get gaugeStyle(): Record<string, string> {
    const angle = Math.round(360 * this.gaugePercent / 100);
    return {
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      background: `conic-gradient(#2563eb ${angle}deg, #e5e7eb 0)`,
      display: 'grid',
      placeItems: 'center'
    };
  }
  get gaugeCenterStyle(): Record<string, string> {
    return {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: '#fff',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center'
    };
  }

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
    const option = this.gradeOptions.find((o: { value: string; label: string }) => o.value === value);
    return option ? option.label : value;
  }

  // Métodos de paginación del historial eliminados

  private checkAssessments(): void {
    const token = this.session.getAccessToken();
    if (!token) return;

    this.testService.listAssessments(token).subscribe({
      next: (assessments) => {
        console.log('Todos los assessments:', assessments);
        console.log('Total de assessments recibidos:', assessments.length);
        
        const completed = assessments.filter(a => a.status === 'COMPLETED');
        console.log('Assessments completados:', completed);
        console.log('Total completados:', completed.length);
        
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
          // Historial embebido eliminado; no hay paginación local que reiniciar
          console.log('lastAssessmentId asignado:', this.lastAssessmentId);
          this.computeStreakFromAttempts();
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
          this.streakDays = 0;
          // Mensaje claro para el usuario cuando no hay intentos
          this.statusMessage = 'sin intentos, realice uno nuevo';
        }
      },
      error: (err) => console.error('Error verificando historial', err)
    });
  }

  private computeStreakFromAttempts(): void {
    try {
      const dateKeys = new Set(
        this.completedAttempts
          .map(a => a.completedAt ? new Date(a.completedAt).toISOString().slice(0, 10) : undefined)
          .filter((d): d is string => !!d)
      );
      let streak = 0;
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      while (dateKeys.has(new Date(d).toISOString().slice(0, 10))) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      this.streakDays = streak;
    } catch {
      this.streakDays = 0;
    }
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

  openHistory(): void {
    this.router.navigate(['/history']);
  }
  // Acciones de ver/eliminar intento movidas a la página /history

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

  viewAchievements(): void {
    this.router.navigate(['/achievements']);
  }

  viewMaterials(): void {
    this.router.navigate(['/materials']);
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
    this.viewingProfile = false;
    try {
      const el = document.getElementById('hero-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  viewProfile(): void {
    this.editingProfile = false;
    this.viewingProfile = true;
    try {
      const el = document.getElementById('profile-card');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
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