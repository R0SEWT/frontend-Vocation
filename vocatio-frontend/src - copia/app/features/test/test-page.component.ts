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
    
      @if (loading) {
        <div class="loading-section">
          <div class="loading-card">
            <p>{{ loadingMessage }}</p>
          </div>
        </div>
      }
    
      @if (viewMode === 'test' && !loading && !showResults && currentQuestion) {
        <section class="question-section">
          <div class="question-card">
            <div class="question-header">
              <span class="question-icon">💭</span>
              <h2>{{ currentQuestion.question }}</h2>
            </div>
            <div class="options-grid">
              @for (option of currentQuestion.options; track option) {
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
                <span>¿Quieres contarnos algo más sobre tus intereses?</span>
                <textarea
                  rows="4"
                  maxlength="400"
                  [formControl]="opinionControl"
                  placeholder="Comparte detalles adicionales..."
                ></textarea>
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
          </div>
        </div>
      }
    
      @if (!loading && showResults) {
        <section class="results-card">
          <h2>{{ viewMode === 'result' ? 'Resultados Guardados' : '¡Test completado!' }}</h2>
          
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
                        @for (area of (submissionResult?.topAreas || insights?.suggestedCareers || []); track area) {
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
              @if (viewMode === 'result') {
                <button class="secondary-action" type="button" (click)="retakeTest()">Realizar nuevo test</button>
              }
            </div>
          </section>
        }
      </main>
    `,
  styles: [testPageStyles]
})
export class TestPageComponent implements OnInit {
  viewMode: 'test' | 'result' = 'test';
  loadingMessage = 'Cargando...';
  
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
    default: 'mbti-avatars/intp.webp'
  };

  constructor(
    private testService: TestService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private insightsService: InsightsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const resultId = this.route.snapshot.paramMap.get('id');
    if (resultId) {
      this.viewMode = 'result';
      this.loadExistingResult(resultId);
    } else {
      this.viewMode = 'test';
      this.prepareTest();
    }
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
    this.showResults = true;

    this.testService.fetchResult(id, token).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (result) => {
        this.submissionResult = result;
        this.assessmentId = id;
        
        // Simulamos el objeto insights con los datos que tenemos del backend
        this.insights = {
            mbtiProfile: 'Result', 
            suggestedCareers: result.suggestedCareers || result.topAreas,
            profileSummary: 'Resultado histórico recuperado.'
        };
      },
      error: (err) => {
        this.statusMessage = 'No se pudo cargar el resultado solicitado.';
        console.error(err);
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
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answersByQuestion = {};
    this.answerValues = {};
    this.showResults = false;
    this.opinionControl.enable();
    this.submissionResult = undefined;
    this.usingFallback = false;
    this.assessmentId = undefined;
    this.insights = undefined;

    if (!this.useRemoteTestApi) {
      this.statusMessage = 'Modo demo: usamos preguntas locales.';
      this.loadFallbackQuestions();
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
    
    this.testService
      .fetchQuestions(assessmentId, token)
      .pipe(finalize(() => { 
          this.loading = false; 
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
    } else {
      this.submitTest();
    }
  }

  goBack(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  submitTest(): void {
    if (this.usingFallback) {
        // Lógica local simple
        this.showResults = true;
        this.insights = { mbtiProfile: 'DEMO', suggestedCareers: ['Tecnología', 'Ciencias'], profileSummary: 'Modo local finalizado.' };
        return;
    }

    const token = this.session.getAccessToken();
    if (!token) return;

    this.loading = true;
    this.loadingMessage = 'Analizando tus respuestas con IA...';
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
            this.insights = response;
            this.loading = false;
            this.cdr.detectChanges();
            // Opcional: Llamar a submitTest del backend para cerrar el intento
        },
        error: (err) => {
            this.loading = false;
            this.statusMessage = 'Error generando insights.';
            this.cdr.detectChanges();
        }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  retakeTest(): void {
    // Navegar a la misma ruta base para limpiar el ID
    this.router.navigate(['/test'])
      .then(() => {
        // Forzar recarga del componente
        window.location.reload(); 
      });
  }
}