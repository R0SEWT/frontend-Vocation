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
        <section class="card" style="margin-bottom:16px; padding:24px 28px; background:#ffffff; border-radius:16px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
          <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <p class="eyebrow" style="letter-spacing:0.06em;">VOCATIO</p>
              <h2 style="font-size:34px; line-height:42px;">Panel principal</h2>
            </div>
            <div class="header-tip" style="max-width:420px;">
              <p class="subtitle" style="margin:0; font-size:17px; color:#374151;">Sigue tus resultados y recomendaciones vocacionales desde un solo lugar.</p>
            </div>
          </div>
        </section>
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

      <!-- Resumen integrado dentro de la tarjeta de Perfil -->
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

        <article class="profile-card mini">
          <p class="eyebrow">Perfil</p>
          <div class="profile-body profile-header">
            <div class="avatar" style="width:64px;height:64px;border-radius:50%;background:#e5e7eb;"></div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="font-weight:600;">{{ profile?.name || profile?.email || 'Sin nombre' }}</div>
                <small>{{ getGradeLabel(profile?.grade) || 'Sin grado definido' }}</small>
              </div>

              <div class="summary-grid">
                <article class="status-card mini" style="display:flex; flex-direction:column; justify-content:center; min-height:120px;">
                  <p class="eyebrow">Último intento</p>
                  <div>
                    <div style="font-weight:600;">{{ lastAttemptLabel }}</div>
                    <small>{{ lastAttemptDateLabel }}</small>
                  </div>
                </article>
                <article class="status-card mini" style="display:flex; flex-direction:column; justify-content:center; min-height:120px;">
                  <p class="eyebrow">Favoritos</p>
                  <div>
                    <div style="font-weight:600;">{{ favoritesCount }}</div>
                    <small>Carreras marcadas</small>
                  </div>
                </article>
                @if (lastResult) {
                  <article class="status-card mini" style="display:flex; flex-direction:column; justify-content:space-between; min-height:120px;">
                    <p class="eyebrow">Resultado</p>
                    <div>
                      <div style="font-weight:600;">{{ lastResult?.mbtiProfile || '—' }}</div>
                      <small>Ver detalle</small>
                    </div>
                    <div class="card-actions" style="margin-top:8px;">
                      <button class="secondary-action small" (click)="viewLastResult()">Abrir resultado</button>
                    </div>
                  </article>
                } @else {
                  <article class="status-card mini" style="display:flex; flex-direction:column; justify-content:space-between; min-height:120px;">
                    <p class="eyebrow">Materiales</p>
                    <div>
                      <small>Explora materiales y/o realiza el test para sugerencias.</small>
                    </div>
                    <div class="card-actions" style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                      <button class="secondary-action small" type="button" (click)="viewMaterials()">Ver materiales</button>
                      <button class="primary-action small" type="button" (click)="takeVocationalTest()">Realizar test</button>
                    </div>
                  </article>
                }
              </div>
              <div class="profile-actions">
                <button class="secondary-action small" type="button" (click)="viewCareers()">Ver carreras</button>
                <button class="secondary-action small" type="button" (click)="viewMaterials()">Ver materiales</button>
              </div>
            </div>
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
  lastResult?: any;
  private assessmentsCacheKey = 'vocatio:cache:assessments';
  private resultCacheKey = (id: string) => `vocatio:cache:result:${id}`;
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
    // Suscribirse al estado compartido de perfil para evitar parpadeo
    this.profileService.profile$.subscribe(p => {
      if (p) {
        this.profile = p;
      }
    });
    this.checkAssessments();
    this.loadFavoritesCount();
    // Intento de carga instantánea desde caché para evitar demoras visuales
    this.loadFromCache();
    // Asegurar carga inicial completa (perfil, intentos, resultado) cuando hay token
    this.ensureInitialData();
    // Refrescar si hay bandera de actualización desde otras páginas
    try {
      const flag = localStorage.getItem('vocatio:refresh:home');
      if (flag === '1') {
        localStorage.removeItem('vocatio:refresh:home');
        this.loadProfile();
        this.checkAssessments();
        this.loadFavoritesCount();
        this.ensureInitialData();
      }
    } catch {}
    // Refrescar resumen al volver a Home o cambiar de sección
    this.router.events.subscribe(evt => {
      try {
        const url = (this.router.url || '').toLowerCase();
        if (url === '/' || url.startsWith('/home')) {
          this.loadProfile();
          this.checkAssessments();
          this.loadFavoritesCount();
          this.ensureInitialData();
        }
      } catch {}
    });
    // Reaccionar a solicitudes de refresco vía query params
    this.route.queryParamMap.subscribe(params => {
      if (params.has('refresh')) {
        console.log('Refrescando historial por query param refresh');
        this.checkAssessments();
        this.loadProfile();
        this.loadFavoritesCount();
        this.ensureInitialData();
      }
    });
  }

  private loadFromCache(): void {
    try {
      const raw = localStorage.getItem(this.assessmentsCacheKey);
      if (raw) {
        const list = JSON.parse(raw) as Array<{ id: string; status: string; completedAt?: string; updatedAt?: string }>;
        if (Array.isArray(list) && list.length) {
          const completed = list.filter(a => (a.status || '').toUpperCase() === 'COMPLETED');
          const sorted = completed.slice().sort((a, b) => Number(b.id) - Number(a.id));
          if (sorted.length) {
            this.lastAssessmentId = sorted[0].id;
            this.completedAttempts = sorted.map(a => ({ id: a.id, completedAt: a.completedAt || a.updatedAt }));
            this.refreshLastAttemptLabels();
            // Intentar cargar resultado desde caché
            const rraw = localStorage.getItem(this.resultCacheKey(this.lastAssessmentId));
            if (rraw) {
              this.lastResult = JSON.parse(rraw);
            }
          }
        }
      }
    } catch {}
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
        
        const completed = assessments.filter(a => (a.status || '').toUpperCase() === 'COMPLETED');
        console.log('Assessments completados:', completed);
        console.log('Total completados:', completed.length);
        
        if (completed.length > 0) {
          // Mostrar IDs ANTES de ordenar
          console.log('IDs de completados (antes de ordenar):', completed.map(a => a.id));
          
          // Ordenar por ID descendente para obtener el más reciente
          const sorted = completed.slice().sort((a, b) => Number(b.id) - Number(a.id));
          
          console.log('IDs de completados (después de ordenar):', sorted.map(a => a.id));
          console.log('El primero (más reciente) es:', sorted[0].id);
          
          this.lastAssessmentId = sorted[0].id;
          this.completedAttempts = sorted.map(a => ({ 
            id: a.id, 
            // Algunos backends no exponen completedAt en el resumen; usar fallback si no está
            completedAt: (a as any).completedAt ?? (a as any).updatedAt ?? undefined 
          }));
          // Cachear assessments para carga instantánea futura
          try {
            const cachePayload = assessments.map((a: any) => ({ id: a.id, status: a.status, completedAt: a.completedAt, updatedAt: a.updatedAt }));
            localStorage.setItem(this.assessmentsCacheKey, JSON.stringify(cachePayload));
          } catch {}
          // Refrescar labels de intento
          this.refreshLastAttemptLabels();
          // Cargar resultado del último intento
          this.loadLastResult();
          // Historial embebido eliminado; no hay paginación local que reiniciar
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
          this.refreshLastAttemptLabels();
          this.lastResult = undefined;
        }
      },
      error: (err) => console.error('Error verificando historial', err)
    });
  }

  private loadLastResult(): void {
    try {
      const token = this.session.getAccessToken();
      if (!token || !this.lastAssessmentId) return;
      const attemptFetch = (retries = 3, delayMs = 300) => {
        this.testService.fetchResult(this.lastAssessmentId!, token).subscribe({
          next: (res: any) => { 
            this.lastResult = res; 
            try { localStorage.setItem(this.resultCacheKey(this.lastAssessmentId!), JSON.stringify(res)); } catch {}
          },
          error: () => {
            if (retries > 0) {
              setTimeout(() => attemptFetch(retries - 1, delayMs * 1.5), delayMs);
            } else {
              this.lastResult = undefined;
            }
          }
        });
      };
      attemptFetch();
    } catch { this.lastResult = undefined; }
  }

  // For login → home scenarios: on first load, if token exists but profile/result are empty, kick off loads
  private ensureInitialData(): void {
    const hasToken = !!this.session.getAccessToken();
    if (!hasToken) return;
    if (!this.profile) this.loadProfile();
    if (!this.completedAttempts?.length) this.checkAssessments();
    if (this.lastAssessmentId && !this.lastResult) this.loadLastResult();
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
  // Resumen: últimos intentos y favoritos
  get lastAttemptLabel(): string {
    if (this.completedAttempts.length === 0) return 'Sin intentos';
    return 'Completado';
  }
  get lastAttemptDateLabel(): string {
    if (this.completedAttempts.length === 0) return '';
    const d = this.completedAttempts[0]?.completedAt ? new Date(this.completedAttempts[0].completedAt) : undefined;
    return d && !isNaN(d.getTime()) ? d.toLocaleString() : '';
  }
  private refreshLastAttemptLabels(): void { /* computed via getters */ }
  favoritesCount = 0;
  private favKey = 'vocatio:favorites:careers';
  private loadFavoritesCount(): void {
    try {
      const raw = localStorage.getItem(this.favKey);
      const list = raw ? JSON.parse(raw) : [];
      this.favoritesCount = Array.isArray(list) ? list.length : 0;
    } catch { this.favoritesCount = 0; }
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
    /* eliminado */
  }

  viewMaterials(): void {
    this.router.navigate(['/materials']);
  }

  viewCareers(): void {
    this.router.navigate(['/careers']);
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