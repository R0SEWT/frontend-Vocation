import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute
import {
  TestOption,
  TestQuestion,
  TestResult,
  VocationalInsights
} from '../../core/validators/models/learning.models';
import { finalize } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { TestService } from '../../core/services/test.service';
import { testPageStyles } from './test-page.styles';
import { FEATURE_FLAGS } from '../../core/constants/feature-flags.constants';
import { InsightsService } from '../../core/services/insights.service';

const FALLBACK_QUESTIONS: TestQuestion[] = [
  {
    id: '1',
    question: '¿Qué actividades te hacen perder la noción del tiempo?',
    options: [
      { id: '1a', text: 'Resolver problemas matemáticos o lógicos', value: 'ciencias' },
      { id: '1b', text: 'Crear arte o diseñar cosas', value: 'artes' },
      { id: '1c', text: 'Ayudar a otras personas', value: 'social' },
      { id: '1d', text: 'Trabajar con computadoras o tecnología', value: 'tecnologia' }
    ]
  },
  // ... (Puedes dejar el resto de preguntas fallback aquí como estaban)
];

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="test-shell">
      @if (viewMode === 'result') {
        <section class="test-hero">
          <p class="eyebrow">Historial</p>
          <h1>Tu Perfil Vocacional</h1>
          <p class="subtitle">Estos son los resultados de tu evaluación guardada.</p>
        </section>
      } @else {
        <section class="test-hero">
          <p class="eyebrow">Test Vocacional</p>
          <h1>Explora tus intereses profesionales</h1>
          <p class="subtitle">
            Responde las preguntas que mejor describen tus preferencias.
          </p>
        </section>
      }
    
      @if (statusMessage) {
        <p class="status">{{ statusMessage }}</p>
      }
    
      @if (viewMode === 'test' && !loading && !showResults && questions.length) {
        <div class="test-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage"></div>
          </div>
          <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
        </div>
      }
    
      @if (loading && !showResults) {
        <div class="loading-section">
          <div class="loading-card">
            <div class="loader-spinner" aria-hidden="true"></div>
            <p>{{ loadingMessage }}</p>
            @if (loadingSubtitle) {
              <p class="loader-subtitle">{{ loadingSubtitle }}</p>
            }
          </div>
        </div>
      }
    
      @if (viewMode === 'test' && !loading && !showResults && currentQuestion) {
        <section class="question-section">
          <div class="question-card">
            <div class="question-header">
              <span class="question-icon" aria-hidden="true">?</span>
              <h2>{{ currentQuestion.question }}</h2>
            </div>
            <div class="options-grid">
              @for (option of currentQuestion.options; track option.id) {
                <button
                  class="option-button"
                  type="button"
                  [class.selected]="answersByQuestion[currentQuestion.id] === option.id"
                  (click)="selectOption(option)"
                  >
                  {{ option.text }}
                </button>
              }
            </div>
            <div class="insight-notes">
              <label>
                <span>Enfoque del test</span> 
                <textarea
                  rows="4"
                  maxlength="255"
                  [formControl]="opinionControl"
                  placeholder="- ¿Alguna decision en la que el test te pueda asistir? 
- ¿elegir un enfoque, carrera o especializacion?

Tambien puedes compartir algo sobre ti"
                ></textarea>
                @if (isLastQuestion) {
                  <small class="field-hint">
                    Antes de finalizar el test, cuéntanos brevemente:
                    
                    
                    <span class="char-counter" [class.invalid]="!hasRequiredOpinion">
                      {{ opinionCharCount }}/50 *
                    </span>
                  </small>
                }
              </label>
            </div>
          </div>
        </section>

        <div class="actions-section">
          <div class="navigation-actions">
            <button
              class="secondary-action"
              type="button"
              (click)="goBack()"
              [disabled]="currentQuestionIndex === 0"
              >
              Anterior
            </button>
            <button class="primary-action" type="button" (click)="goToHome()">Cancelar</button>
            @if (isLastQuestion) {
              <button
                class="primary-action"
                type="button"
                (click)="finalizeAssessment()"
                [disabled]="!canFinalizeTest"
              >
                Finalizar test
              </button>
            }
          </div>
        </div>
      }
    
      @if (showResults) {
        <section class="results-card">
          <h2>{{ viewMode === 'result' ? 'Resultados Guardados' : (loading ? 'Analizando tus respuestas...' : '¡Test completado!') }}</h2>
          
          @if (loading) {
            <div class="results-loading">
              <div class="loader-spinner large" aria-hidden="true"></div>
              <p>{{ loadingMessage }}</p>
              @if (loadingSubtitle) {
                <p class="loader-subtitle">{{ loadingSubtitle }}</p>
              }
            </div>
          } @else {
            <section class="insights-panel">
              <h3>Perfil Vocacional</h3>
              
              @if (insights || submissionResult) {
                <div class="insights-grid">
                  <div class="mbti-highlight">
                    <div class="mbti-figure">
                      <img
                        class="mbti-avatar"
                        [src]="getMbtiAvatar(insights?.mbtiProfile)"
                        [alt]="'Arquetipo'"
                        />
                        <div class="mbti-badge">{{ insights?.mbtiProfile || 'PERFIL' }}</div>
                      </div>
                      <p class="mbti-caption">Arquetipo Vocacional</p>
                    </div>
                    
                    <div class="insights-detail">
                      <div class="insights-block">
                        <h4>Áreas Principales</h4>
                        <div class="qualities">
                          @for (area of (insights?.suggestedCareers || []); track area) {
                            <span class="quality-chip">{{ area }}</span>
                          }
                        </div>
                      </div>

                      @if (insights?.qualities?.length) {
                        <div class="insights-block">
                          <h4>Cualidades</h4>
                          <div class="qualities">
                            @for (quality of insights?.qualities; track quality) {
                              <span class="quality-chip secondary">{{ quality }}</span>
                            }
                          </div>
                        </div>
                      }

                      @if (insights?.profileSummary) {
                        <div class="insights-block">
                          <h4>Resumen</h4>
                          <p class="profile-summary">{{ insights?.profileSummary }}</p>
                        </div>
                      }
                    </div>
                  </div>
                } @else {
                  <p class="empty">No se pudieron cargar los detalles del resultado.</p>
                }
            </section>

            <div class="results-actions">
              <button class="primary-action" type="button" (click)="goToHome()">Ir al Inicio</button>
              <button class="secondary-action" type="button" (click)="retakeTest()">Realizar nuevo test</button>
              @if (viewMode === 'result' && assessmentId) {
                <button class="secondary-action danger" type="button" (click)="deleteCurrentAssessment()" [disabled]="deletingAssessment">
                  {{ deletingAssessment ? 'Eliminando...' : 'Eliminar evaluación' }}
                </button>
              }
            </div>
          }
        </section>
      }
      </main>
    `,
  styles: [testPageStyles]
})
export class TestPageComponent implements OnInit {
  viewMode: 'test' | 'result' = 'test';
  loadingMessage = 'Cargando...';
  loadingSubtitle = '';
  
  questions: TestQuestion[] = [];
  answersByQuestion: Record<string, string> = {};
  answerValues: Record<string, string> = {};
  assessmentId?: string;
  submissionResult?: TestResult;
  statusMessage = '';
  loading = false;
  showResults = false;
  currentQuestionIndex = 0;
  
  usingFallback = false;
  private readonly useRemoteTestApi = FEATURE_FLAGS.useRemoteTestApi;
  
  opinionControl = new FormControl('', [Validators.maxLength(400)]);
  
  insights?: VocationalInsights;
  deletingAssessment = false;
  
  private readonly mbtiAvatarMap: Record<string, string> = {
    intj: 'mbti-avatars/intj.webp',
    intp: 'mbti-avatars/intp.webp',
    entj: 'mbti-avatars/entj.webp',
    entp: 'mbti-avatars/entp.webp',
    infj: 'mbti-avatars/infj.webp',
    infp: 'mbti-avatars/infp.webp',
    enfj: 'mbti-avatars/enfj.webp',
    enfp: 'mbti-avatars/enfp.webp',
    istj: 'mbti-avatars/istj.webp',
    isfj: 'mbti-avatars/isfj.webp',
    estj: 'mbti-avatars/estj.webp',
    esfj: 'mbti-avatars/esfj.webp',
    istp: 'mbti-avatars/istp.webp',
    isfp: 'mbti-avatars/isfp.webp',
    estp: 'mbti-avatars/estp.webp',
    esfp: 'mbti-avatars/esfp.webp',
    hist: 'mbti-avatars/intp.webp',
    default: 'mbti-avatars/intp.webp'
  };

  private justCompletedTest = false; // Flag para prevenir sobreescritura
  
  constructor(
    private testService: TestService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private insightsService: InsightsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const resultId = params.get('id');
      
      console.log('Cambio de ruta detectado:', { resultId, justCompletedTest: this.justCompletedTest });
      
      // Si acabamos de completar un test nuevo, NO cargar resultados antiguos
      if (this.justCompletedTest && this.insights) {
        console.log('Evitando recarga - test recién completado con insights:', this.insights.mbtiProfile);
        return;
      }
      
      if (resultId) {
        console.log('Cargando resultado con ID:', resultId);
        this.viewMode = 'result';
        this.loadExistingResult(resultId);
      } else {
        console.log('Iniciando nuevo test');
        this.viewMode = 'test';
        this.prepareTest();
      }
    });
  }

  // Persistir y recuperar insights locales por assessmentId
  private saveInsightsLocal(assessmentId?: string, insights?: VocationalInsights): void {
    try {
      if (!assessmentId || !insights) return;
      const key = `vocatio:insights:${assessmentId}`;
      localStorage.setItem(key, JSON.stringify(insights));
      console.log('Insights guardados localmente para', assessmentId);
    } catch (e) {
      console.warn('No se pudo guardar insights localmente:', e);
    }
  }

  private getInsightsLocal(assessmentId: string): VocationalInsights | undefined {
    try {
      const key = `vocatio:insights:${assessmentId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      // Validar forma mínima
      if (parsed && (parsed.mbtiProfile || parsed.suggestedCareers?.length || parsed.profileSummary)) {
        return parsed as VocationalInsights;
      }
      return undefined;
    } catch (e) {
      console.warn('No se pudo leer insights locales:', e);
      return undefined;
    }
  }

  private removeInsightsLocal(assessmentId?: string): void {
    try {
      if (!assessmentId) return;
      const key = `vocatio:insights:${assessmentId}`;
      localStorage.removeItem(key);
      console.log('Insights locales eliminados para', assessmentId);
    } catch {}
  }

  get currentQuestion(): TestQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get progressPercentage(): number {
    return this.questions.length ? ((this.currentQuestionIndex + 1) / this.questions.length) * 100 : 0;
  }

  getMbtiAvatar(profile?: string): string {
    if (!profile) return this.mbtiAvatarMap['default'];
    return this.mbtiAvatarMap[profile.toLowerCase()] ?? this.mbtiAvatarMap['default'];
  }

  private loadExistingResult(id: string): void {
    const token = this.session.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loading = true;
    this.loadingMessage = 'Recuperando resultados guardados...';
    this.loadingSubtitle = 'Esto puede tardar hasta 4 segundos.';
    this.showResults = true;

    this.testService.fetchResult(id, token).pipe(
      finalize(() => {
        this.loading = false;
        this.loadingSubtitle = '';
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (result) => {
        console.log('Resultado recibido del backend:', result);
        this.submissionResult = result;
        this.assessmentId = id;
        
        // Función auxiliar para normalizar datos (objetos o strings)
        const normalizeItems = (items: any[]): string[] => {
          if (!items || items.length === 0) return [];
          return items.map((item: any) => 
            typeof item === 'string' ? item : item.name || item.title || String(item)
          );
        };
        
        // Construir el objeto insights con los datos completos del backend
        // Priorizar suggestedCareers, luego topAreas como fallback
        const rawCareers = result.suggestedCareers && result.suggestedCareers.length > 0 
          ? result.suggestedCareers 
          : (result.topAreas && result.topAreas.length > 0 ? result.topAreas : []);
        
        // Transformar objetos {id, name} a strings si es necesario
        const careers = normalizeItems(rawCareers);
        
        console.log('Carreras procesadas:', careers);
        console.log('Datos completos del resultado:', {
          hasTopAreas: !!result.topAreas,
          hasSuggestedCareers: !!result.suggestedCareers,
          hasQualities: !!(result as any).qualities,
          hasChart: !!result.chart,
          completedAt: result.completedAt
        });
        
        if (careers.length === 0) {
          this.statusMessage = 'Este resultado no contiene datos de áreas o carreras.';
        }
        
        // Extraer cualidades si están disponibles en el resultado
        const qualities = normalizeItems((result as any).qualities || []);
        
        // Extraer datos del chart si están disponibles
        // El chart puede tener diferentes estructuras, intentar adaptarse
        let chartData: Record<string, number> = {};
        if (result.chart) {
          // Si chart tiene una propiedad 'data' o 'scores', usar esa
          if ((result.chart as any).data) {
            chartData = (result.chart as any).data;
          } else if ((result.chart as any).scores) {
            chartData = (result.chart as any).scores;
          } else if (typeof result.chart === 'object') {
            // Filtrar solo propiedades numéricas
            chartData = Object.fromEntries(
              Object.entries(result.chart).filter(([key, value]) => 
                typeof value === 'number' && key !== 'type'
              )
            );
          }
        }
        
        const chartScores = Object.entries(chartData)
          .map(([area, score]) => ({
            area,
            score: typeof score === 'number' ? score : 0
          }))
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);
        
        // Construir profileSummary con información disponible
        let summaryText = 'Este es el resultado de tu evaluación vocacional.';
        
        // Agregar información sobre las áreas principales
        if (result.topAreas && result.topAreas.length > 0) {
          const topAreasNames = normalizeItems(result.topAreas).slice(0, 3);
          summaryText = `Tus áreas de mayor afinidad son: ${topAreasNames.join(', ')}.`;
          
          // Agregar información sobre puntajes si hay datos válidos del chart
          if (chartScores.length > 0 && chartScores[0].score > 0) {
            const topScore = chartScores[0];
            summaryText += ` Destacas especialmente en ${topScore.area}.`;
          }
        }
        
        // Generar cualidades genéricas basadas en las áreas si no hay cualidades específicas
        let finalQualities = qualities;
        if (qualities.length === 0 && result.topAreas && result.topAreas.length > 0) {
          // Mapeo de áreas a cualidades típicas
          const areaQualities: Record<string, string[]> = {
            'Creatividad': ['Creativo', 'Innovador', 'Expresivo'],
            'Ciencias de la Salud': ['Empático', 'Analítico', 'Detallista'],
            'Ciencias Sociales': ['Social', 'Comunicativo', 'Reflexivo'],
            'Ingeniería y Tecnología': ['Lógico', 'Metódico', 'Resolutivo'],
            'Ciencias Exactas': ['Analítico', 'Preciso', 'Investigador'],
            'Negocios': ['Estratégico', 'Líder', 'Organizado']
          };
          
          const inferredQualities = new Set<string>();
          normalizeItems(result.topAreas).forEach(area => {
            const matchedQualities = areaQualities[area];
            if (matchedQualities) {
              matchedQualities.forEach(q => inferredQualities.add(q));
            }
          });
          
          finalQualities = Array.from(inferredQualities).slice(0, 5);
        }
        
        this.insights = {
            mbtiProfile: 'HIST', // Indicador de que es un resultado histórico
            suggestedCareers: careers,
            qualities: finalQualities.length > 0 ? finalQualities : undefined,
            profileSummary: summaryText
        };
        
        console.log('Insights configurados:', this.insights);

        // Si existen insights guardados localmente para este assessment, priorizarlos para fidelidad
        const saved = this.getInsightsLocal(id);
        if (saved) {
          this.insights = saved;
          console.log('Usando insights locales guardados para mantener consistencia histórica:', this.insights);
        }

        // Intentar recuperar insights persistidos en el backend y priorizarlos si existen
        if (token) {
          this.testService.fetchInsights(id, token).subscribe({
            next: (serverInsights) => {
              const normalizeItems = (items: any[]): string[] => {
                if (!items || items.length === 0) return [];
                return items.map((item: any) => typeof item === 'string' ? item : item.name || item.title || String(item));
              };

              const mbti: string = (serverInsights.mbtiProfile ?? this.insights?.mbtiProfile ?? 'HIST') as string;
              const summary: string = (serverInsights.profileSummary ?? this.insights?.profileSummary ?? 'Este es el resultado de tu evaluación vocacional.') as string;

              const normalized: VocationalInsights = {
                mbtiProfile: mbti,
                suggestedCareers: normalizeItems(serverInsights.suggestedCareers || this.insights?.suggestedCareers || []),
                qualities: normalizeItems((serverInsights as any).qualities || this.insights?.qualities || []),
                profileSummary: summary
              };

              this.insights = normalized;
              this.saveInsightsLocal(id, normalized);
              console.log('Insights recuperados del backend y aplicados:', this.insights);
            },
            error: () => {
              // Silencioso: mantenemos local o construido por backend
            }
          });
        }
      },
      error: (err) => {
        this.statusMessage = 'No se pudo cargar el resultado solicitado.';
        console.error('Error cargando resultado:', err);
      }
    });
  }

  prepareTest(): void {
    const token = this.session.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Preparando la evaluación...';
    this.loadingSubtitle = 'Esto suele tomar entre 2 y 4 segundos.';
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answersByQuestion = {};
    this.answerValues = {};
    this.showResults = false;
    this.opinionControl.enable();
    this.opinionControl.reset('');
    this.opinionControl.markAsPristine();
    this.opinionControl.markAsUntouched();
    this.submissionResult = undefined;
    this.usingFallback = false;
    this.assessmentId = undefined;
    this.insights = undefined;

    if (!this.useRemoteTestApi) {
      this.statusMessage = 'Modo demo: usamos preguntas locales.';
      this.loadFallbackQuestions();
      this.loadingSubtitle = '';
      return;
    }

    this.testService
      .createAssessment(token)
      .pipe(finalize(() => {
          if (this.loading) {
             this.loading = false; 
             this.cdr.detectChanges();
          }
      }))
      .subscribe(
        ({ assessmentId }) => this.loadQuestions(token, assessmentId),
        (error: any) => {
          if (error?.status === 409) {
            this.statusMessage = 'Recuperando intento en progreso...';
            this.recoverInProgressAssessment(token);
            return;
          }
          this.statusMessage = 'Error conectando al servidor. Usando modo local.';
          this.loadFallbackQuestions();
        }
      );
  }

  private loadQuestions(token: string, assessmentId: string): void {
    this.assessmentId = assessmentId;
    this.loading = true;
    this.loadingMessage = 'Cargando preguntas...';
    this.loadingSubtitle = 'Estamos preparando tus preguntas. Esto tomará solo unos segundos.';
    
    this.testService
      .fetchQuestions(assessmentId, token)
      .pipe(finalize(() => { 
          this.loading = false; 
          this.loadingSubtitle = '';
          this.cdr.detectChanges(); 
      }))
      .subscribe(
        ({ questions, answers }) => {
          if (!questions.length) {
            this.loadFallbackQuestions();
            return;
          }
          this.questions = questions;
          this.restoreAnswers(answers);
        },
        () => this.loadFallbackQuestions()
      );
  }

  private loadFallbackQuestions(): void {
    this.usingFallback = true;
    this.questions = [...FALLBACK_QUESTIONS];
    this.loading = false;
    this.loadingSubtitle = '';
    this.cdr.detectChanges();
  }

  private restoreAnswers(answers: any[]): void {
      if (!answers) return;
      // Lógica de restauración básica
      answers.forEach(a => {
          this.answersByQuestion[a.questionId] = a.optionId;
          this.answerValues[a.questionId] = a.optionId; // Simplificación
      });
  }

  private recoverInProgressAssessment(token: string): void {
      // Lógica simplificada de recuperación
      this.testService.listAssessments(token).subscribe(assessments => {
          const wip = assessments.find(a => a.status === 'IN_PROGRESS');
          if (wip) this.loadQuestions(token, wip.id);
          else this.loadFallbackQuestions();
      });
  }

  selectOption(option: TestOption): void {
    const question = this.currentQuestion;
    if (!question) return;

    this.answersByQuestion[question.id] = option.id;
    this.answerValues[question.id] = option.value;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goBack(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  submitTest(): void {
    if (this.usingFallback) {
        // Lógica local simple
        this.showResults = true;
        this.loadingSubtitle = '';
        this.insights = { mbtiProfile: 'DEMO', suggestedCareers: ['Tecnología', 'Ciencias'], profileSummary: 'Modo local finalizado.' };
        return;
    }

    const token = this.session.getAccessToken();
    if (!token) return;

    this.loading = true;
    this.loadingMessage = 'Analizando tus respuestas con IA...';
    this.loadingSubtitle = 'Este proceso puede tardar hasta 60 segundos. Gracias por tu paciencia.';
    this.showResults = true;

    const answersPayload = this.questions.map(q => ({
        questionId: q.id,
        optionId: this.answersByQuestion[q.id],
        value: this.answerValues[q.id]
    })).filter(a => a.optionId);

    this.insightsService.generateVocationalInsights({ 
        answers: answersPayload, 
        notes: this.opinionControl.value || undefined 
    }).subscribe({
        next: (response) => {
            console.log('Respuesta de IA recibida:', response);
            console.log('Tipo de respuesta:', typeof response);
            console.log('Keys de la respuesta:', Object.keys(response || {}));
            console.log('mbtiProfile:', response?.mbtiProfile);
            console.log('suggestedCareers:', response?.suggestedCareers);
            console.log('qualities:', response?.qualities);
            console.log('profileSummary:', response?.profileSummary);
            console.log('assessmentId en respuesta:', response?.assessmentId);
            
            // Actualizar el assessmentId con el valor real del backend
            if (response?.assessmentId) {
              console.log('Actualizando assessmentId de', this.assessmentId, 'a', response.assessmentId);
              this.assessmentId = String(response.assessmentId);
            }
            
            // Normalizar suggestedCareers si vienen como objetos
            const normalizeItems = (items: any[]): string[] => {
              if (!items || items.length === 0) return [];
              return items.map((item: any) => 
                typeof item === 'string' ? item : item.name || item.title || String(item)
              );
            };
            
            this.insights = {
              ...response,
              suggestedCareers: normalizeItems(response.suggestedCareers || [])
            };
            
            console.log('Insights configurados (nuevo test):', this.insights);
            console.log('insights.suggestedCareers:', this.insights.suggestedCareers);
            console.log('insights.qualities:', this.insights.qualities);
            console.log('insights.profileSummary:', this.insights.profileSummary);

            // Guardar una copia local para consultas históricas consistentes
            this.saveInsightsLocal(this.assessmentId, this.insights);

            // Intentar persistir insights en backend (opcional)
            const token = this.session.getAccessToken();
            if (token && this.assessmentId) {
              this.testService.saveInsights(this.assessmentId, token, this.insights).subscribe({
                next: (res) => console.log('Insights guardados en backend:', res),
                error: (err) => console.warn('No se pudieron guardar insights en backend (se mantiene local):', err)
              });
            }
            
            // Marcar que acabamos de completar el test para prevenir sobreescritura
            this.justCompletedTest = true;
            this.viewMode = 'test'; // Mantener en 'test' para mostrar "¡Test completado!"
            
            this.loading = false;
            this.loadingSubtitle = '';
            this.cdr.detectChanges();
            
            // Verificar estado final del componente
            console.log('🎯 Estado final:', {
              showResults: this.showResults,
              loading: this.loading,
              mbtiProfile: this.insights?.mbtiProfile,
              careersCount: this.insights?.suggestedCareers?.length,
              hasInsights: !!this.insights,
              justCompletedTest: this.justCompletedTest,
              viewMode: this.viewMode,
              currentUrl: window.location.href
            });
            console.log('TEST NUEVO COMPLETADO - NO DEBE CARGAR TEST ANTIGUO');
            console.log('Assessment ID del test completado:', this.assessmentId);
            console.log('🔑 Este ID debe ser el que aparece como último en el home:', this.assessmentId);
        },
        error: (err) => {
            console.error('Error generando insights:', err);
            this.loading = false;
            this.statusMessage = 'Error generando insights.';
            this.loadingSubtitle = '';
            this.cdr.detectChanges();
        }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  get opinionCharCount(): number {
    return this.opinionControl.value?.trim().length ?? 0;
  }

  get hasRequiredOpinion(): boolean {
    return this.opinionCharCount >= 50 && this.opinionCharCount <= 400;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get hasAnsweredCurrentQuestion(): boolean {
    const current = this.currentQuestion;
    if (!current) return false;
    return !!this.answersByQuestion[current.id];
  }

  get canFinalizeTest(): boolean {
    return this.isLastQuestion && this.hasAnsweredCurrentQuestion && this.hasRequiredOpinion && !this.loading;
  }

  finalizeAssessment(): void {
    if (!this.canFinalizeTest) {
      this.opinionControl.markAsTouched();
      return;
    }
    this.submitTest();
  }

  retakeTest(): void {
    // Resetear el estado del componente para realizar un nuevo test
    this.viewMode = 'test';
    this.showResults = false;
    this.insights = undefined;
    this.submissionResult = undefined;
    this.assessmentId = undefined;
    this.statusMessage = '';
    this.justCompletedTest = false;
    
    // Navegar a /test sin ID para iniciar nuevo test
    this.router.navigate(['/test']).then(() => {
      this.prepareTest();
    });
  }

  deleteCurrentAssessment(): void {
    if (!this.assessmentId) {
      this.statusMessage = 'No hay evaluación para eliminar.';
      return;
    }

    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.');
    if (!confirmation) return;

    const token = this.session.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.deletingAssessment = true;
    this.statusMessage = '';

    this.testService.deleteAssessment(this.assessmentId, token).subscribe({
      next: (response) => {
        this.statusMessage = response.message || 'Evaluación eliminada correctamente.';
        // Limpiar cache local de insights vinculados
        this.removeInsightsLocal(this.assessmentId);
        setTimeout(() => {
          // Navegar al home forzando refresco del historial
          this.router.navigate(['/home'], { queryParams: { refresh: Date.now() } });
        }, 1500);
      },
      error: (error) => {
        console.error('Error eliminando evaluación:', error);
        this.statusMessage = error.error?.message || 'Error al eliminar la evaluación.';
        this.deletingAssessment = false;
      }
    });
  }
}
