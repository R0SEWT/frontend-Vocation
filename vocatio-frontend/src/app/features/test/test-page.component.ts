
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  {
    id: '2',
    question: 'En un proyecto grupal, ¿qué rol prefieres?',
    options: [
      { id: '2a', text: 'Líder organizando el trabajo', value: 'administracion' },
      { id: '2b', text: 'Investigador buscando información', value: 'investigacion' },
      { id: '2c', text: 'Creador desarrollando ideas', value: 'creativo' },
      { id: '2d', text: 'Ejecutor implementando soluciones', value: 'practico' }
    ]
  },
  {
    id: '3',
    question: '¿Qué tipo de libros te gusta leer?',
    options: [
      { id: '3a', text: 'Ciencia ficción o fantasía', value: 'creativo' },
      { id: '3b', text: 'Biografías de científicos', value: 'ciencias' },
      { id: '3c', text: 'Novelas de misterio', value: 'investigacion' },
      { id: '3d', text: 'Libros de autoayuda', value: 'social' }
    ]
  },
  {
    id: '4',
    question: '¿Qué asignatura te resulta más fácil?',
    options: [
      { id: '4a', text: 'Matemáticas', value: 'ciencias' },
      { id: '4b', text: 'Lenguaje o literatura', value: 'artes' },
      { id: '4c', text: 'Historia o ciencias sociales', value: 'social' },
      { id: '4d', text: 'Informática o tecnología', value: 'tecnologia' }
    ]
  },
  {
    id: '5',
    question: '¿Dónde te ves trabajando en el futuro?',
    options: [
      { id: '5a', text: 'En una oficina con computadoras', value: 'tecnologia' },
      { id: '5b', text: 'En un laboratorio', value: 'ciencias' },
      { id: '5c', text: 'En un estudio creativo', value: 'artes' },
      { id: '5d', text: 'Ayudando a la comunidad', value: 'social' }
    ]
  },
  {
    id: '6',
    question: '¿Qué tipo de problemas te gusta resolver?',
    options: [
      { id: '6a', text: 'Problemas científicos o técnicos', value: 'ciencias' },
      { id: '6b', text: 'Problemas creativos o artísticos', value: 'artes' },
      { id: '6c', text: 'Problemas sociales o humanos', value: 'social' },
      { id: '6d', text: 'Problemas tecnológicos o informáticos', value: 'tecnologia' }
    ]
  },
  {
    id: '7',
    question: 'En una discusión, ¿qué rol tomas?',
    options: [
      { id: '7a', text: 'Presentar argumentos lógicos', value: 'investigacion' },
      { id: '7b', text: 'Expresar ideas creativas', value: 'creativo' },
      { id: '7c', text: 'Mediar entre opiniones', value: 'social' },
      { id: '7d', text: 'Organizar la conversación', value: 'administracion' }
    ]
  },
  {
    id: '8',
    question: '¿Qué te motiva más en un trabajo?',
    options: [
      { id: '8a', text: 'El descubrimiento de nuevos conocimientos', value: 'investigacion' },
      { id: '8b', text: 'La creación de algo nuevo', value: 'creativo' },
      { id: '8c', text: 'Ayudar a otros', value: 'social' },
      { id: '8d', text: 'Resolver desafíos prácticos', value: 'practico' }
    ]
  },
  {
    id: '9',
    question: '¿Qué asignatura prefieres estudiar?',
    options: [
      { id: '9a', text: 'Ciencias naturales', value: 'ciencias' },
      { id: '9b', text: 'Artes o música', value: 'artes' },
      { id: '9c', text: 'Psicología o sociología', value: 'social' },
      { id: '9d', text: 'Programación o ingeniería', value: 'tecnologia' }
    ]
  },
  {
    id: '10',
    question: '¿Cómo te describes a ti mismo?',
    options: [
      { id: '10a', text: 'Analítico y lógico', value: 'ciencias' },
      { id: '10b', text: 'Imaginativo y expresivo', value: 'artes' },
      { id: '10c', text: 'Empático y comunicativo', value: 'social' },
      { id: '10d', text: 'Innovador y práctico', value: 'tecnologia' }
    ]
  }
];

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="test-shell">
      <section class="test-hero">
        <p class="eyebrow">Test Vocacional</p>
        <h1>Explora tus intereses profesionales</h1>
        <p class="subtitle">
          Responde las preguntas que mejor describen tus preferencias. Recibirás un mapa de
          áreas donde puedes tener mayor impacto.
        </p>
      </section>
    
      @if (statusMessage) {
        <p class="status">{{ statusMessage }}</p>
      }
    
      @if (!loading && !showResults && questions.length) {
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
            <p>Cargando preguntas...</p>
          </div>
        </div>
      }
    
      @if (!loading && !showResults && currentQuestion) {
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
                  placeholder="Comparte detalles adicionales que quieras que la IA considere."
                ></textarea>
              </label>
              <div class="insight-note-meta">
                <small class="field-hint">{{ opinionControl.value?.length || 0 }}/400 caracteres</small>
                @if (opinionControl.hasError('maxlength')) {
                  <small class="field-error">Máximo 400 caracteres.</small>
                }
              </div>
            </div>
          </div>
        </section>
      }
    
      @if (!loading && !showResults && currentQuestion) {
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
            <button class="primary-action" type="button" (click)="goToHome()">Ir al inicio</button>
          </div>
        </div>
      }
    
      @if (!loading && showResults) {
        <section class="results-card">
          <h2>¡Test completado!</h2>
          <section class="insights-panel">
            <h3>Perfil powerd by AI</h3>
            @if (insightsLoading) {
              <p class="insights-loading">La IA esta evaluando tu perfil...</p>
            }
            @if (insightsError && !insightsLoading) {
              <p class="field-error">{{ insightsError }}</p>
            }
            @if (insights && !insightsLoading) {
              <div class="insights-grid">
                <div class="mbti-highlight">
                  <div class="mbti-figure">
                    <img
                      class="mbti-avatar"
                      [src]="getMbtiAvatar(insights.mbtiProfile)"
                      [alt]="'Monigote ' + (insights.mbtiProfile || 'MBTI')"
                      />
                      <div class="mbti-badge">{{ insights.mbtiProfile || 'MBTI' }}</div>
                    </div>
                    <p class="mbti-caption">Tu arquetipo MBTI según tus respuestas</p>
                  </div>
                  <div class="insights-detail">
                    <div class="insights-block">
                      <h4>Carreras recomendadas</h4>
                      <ul>
                        @for (career of insights.suggestedCareers; track career) {
                          <li>{{ career }}</li>
                        }
                      </ul>
                    </div>
                    @if (insights.qualities?.length) {
                      <div class="insights-block">
                        <h4>Cualidades que destacan</h4>
                        <div class="qualities">
                          @for (quality of insights.qualities; track quality) {
                            <span class="quality-chip">{{ quality }}</span>
                          }
                        </div>
                      </div>
                    }
                    <div class="insights-block">
                      <h4>Resumen del perfil</h4>
                      <p class="profile-summary">
                        {{ insights.profileSummary }}
                      </p>
                    </div>
                  </div>
                </div>
              }
            </section>
            <div class="results-actions">
              <button class="primary-action" type="button" (click)="goToHome()">Ver recomendaciones</button>
              <button class="secondary-action" type="button" (click)="retakeTest()">Repetir test</button>
            </div>
          </section>
        }
    
        @if (!loading && !showResults && !questions.length) {
          <p class="empty">
            No hay preguntas disponibles en este momento.
          </p>
        }
      </main>
    `,
  styles: [testPageStyles]
})
export class TestPageComponent implements OnInit {
  questions: TestQuestion[] = [];
  answersByQuestion: Record<string, string> = {};
  answerValues: Record<string, string> = {};
  assessmentId?: string;
  submissionResult?: TestResult;
  statusMessage = '';
  loading = false;
  showResults = false;
  currentQuestionIndex = 0;
  topAreas: string[] = [];
  usingFallback = false;
  private readonly useRemoteTestApi = FEATURE_FLAGS.useRemoteTestApi;
  opinionControl = new FormControl('', [Validators.maxLength(400)]);
  insights?: VocationalInsights;
  insightsLoading = false;
  insightsError = '';
  private readonly mbtiAvatarMap: Record<string, string> = {
    intj: 'mbti-avatars/intj.svg',
    intp: 'mbti-avatars/intp.svg',
    entj: 'mbti-avatars/entj.svg',
    entp: 'mbti-avatars/entp.svg',
    infj: 'mbti-avatars/infj.svg',
    infp: 'mbti-avatars/infp.svg',
    enfj: 'mbti-avatars/enfj.svg',
    enfp: 'mbti-avatars/enfp.svg',
    istj: 'mbti-avatars/istj.svg',
    isfj: 'mbti-avatars/isfj.svg',
    estj: 'mbti-avatars/estj.svg',
    esfj: 'mbti-avatars/esfj.svg',
    istp: 'mbti-avatars/istp.svg',
    isfp: 'mbti-avatars/isfp.svg',
    estp: 'mbti-avatars/estp.svg',
    esfp: 'mbti-avatars/esfp.svg',
    default: 'mbti-avatars/default.svg'
  };

  constructor(
    private testService: TestService,
    private session: SessionService,
    private router: Router,
    private insightsService: InsightsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.prepareTest();
  }

  get currentQuestion(): TestQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get progressPercentage(): number {
    if (!this.questions.length) {
      return 0;
    }
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  getMbtiAvatar(profile?: string): string {
    if (!profile) {
      return this.mbtiAvatarMap['default'];
    }

    const key = profile.toLowerCase();
    return this.mbtiAvatarMap[key] ?? this.mbtiAvatarMap['default'];
  }

  prepareTest(): void {
    const token = this.session.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    this.statusMessage = 'Preparando la evaluación...';
    this.questions = [];
    this.resetProgress();
    this.submissionResult = undefined;
    this.usingFallback = false;
    this.topAreas = [];
    this.assessmentId = undefined;
    this.resetInsights();
    this.opinionControl.reset('');

    if (!this.useRemoteTestApi) {
      this.statusMessage = 'Modo demo: usamos preguntas locales mientras restauramos el backend.';
      this.loadFallbackQuestions();
      return;
    }

    this.testService
      .createAssessment(token)
      .pipe(
        finalize(() => {
          // evitar que el spinner se quede prendido si hubo cortes o no se limpió
          if (this.loading) {
            this.loading = false;
            this.cdr.detectChanges();
          }
        })
      )
      .subscribe(
        ({ assessmentId }) => this.loadQuestions(token, assessmentId),
        (error: any) => {
          if (error?.status === 409) {
            this.statusMessage = 'Ya tienes un intento en progreso. Recuperándolo...';
            this.recoverInProgressAssessment(token);
            return;
          }
          this.statusMessage = `${error?.message || 'No se pudo crear el assessment.'}. Se usarán preguntas locales.`;
          console.error('Error creando assessment remoto', error);
          this.loadFallbackQuestions();
        }
      );
  }

  private loadQuestions(token: string, assessmentId: string): void {
    if (!assessmentId) {
      this.statusMessage = 'No se pudo identificar el assessment remoto.';
      this.loadFallbackQuestions();
      return;
    }
    this.assessmentId = assessmentId;
    this.statusMessage = 'Cargando preguntas...';
    this.loading = true;
    this.testService
      .fetchQuestions(assessmentId, token)
      .pipe(
        finalize(() => {
          if (this.loading) {
            this.loading = false;
            this.cdr.detectChanges();
          }
        })
      )
      .subscribe(
        ({ questions, answers }) => {
          if (!questions.length) {
            this.statusMessage = 'No se encontraron preguntas oficiales.';
            this.loadFallbackQuestions();
            return;
          }
          console.info('Preguntas cargadas', questions.length);
          this.questions = questions;
          this.restoreAnswers(answers);
          this.loading = false;
          this.statusMessage = '';
          this.cdr.detectChanges();
        },
        (error: any) => {
          this.statusMessage = `${error?.message || 'No se pudieron cargar las preguntas.'}. Se usarán preguntas locales.`;
          console.error('Error obteniendo preguntas del assessment remoto', error);
          this.loadFallbackQuestions();
        }
      );
  }

  private loadFallbackQuestions(): void {
    this.usingFallback = true;
    this.questions = [...FALLBACK_QUESTIONS];
    this.loading = false;
    this.resetProgress();
    this.statusMessage = 'Usando preguntas locales mientras el backend se estabiliza.';
  }

  private resetProgress(): void {
    this.currentQuestionIndex = 0;
    this.answersByQuestion = {};
    this.answerValues = {};
    this.showResults = false;
    this.opinionControl.enable();
  }

  private resetInsights(): void {
    this.insights = undefined;
    this.insightsError = '';
    this.insightsLoading = false;
  }

  private restoreAnswers(answers: Array<{ questionId: string; optionId: string }>): void {
    if (!answers?.length) {
      return;
    }
    answers.forEach(({ questionId, optionId }) => {
      this.answersByQuestion[questionId] = optionId;
      const optionValue =
        this.questions
          .find((q) => q.id === questionId)
          ?.options.find((opt) => opt.id === optionId)?.value ?? optionId;
      this.answerValues[questionId] = optionValue;
    });
    const firstUnansweredIndex = this.questions.findIndex((q) => !this.answersByQuestion[q.id]);
    this.currentQuestionIndex = firstUnansweredIndex === -1 ? this.questions.length - 1 : firstUnansweredIndex;
  }

  private recoverInProgressAssessment(token: string): void {
    this.testService.listAssessments(token).subscribe({
      next: (assessments) => {
        const inProgress = assessments.find((a) => a.status === 'IN_PROGRESS') || assessments[0];
        if (!inProgress) {
          this.statusMessage = 'No se encontró un assessment pendiente. Usando preguntas locales.';
          this.loadFallbackQuestions();
          return;
        }

        if (inProgress.pages?.length) {
          // Tenemos las páginas y respuestas en la misma respuesta; evitamos otro GET
          const mappedQuestions = inProgress.pages.flatMap((page) =>
            page.questions.map((question) => ({
              id: question.id,
              question: question.title,
              options: question.options.map((option) => ({
                id: option.id,
                text: option.label,
                value: option.label
              }))
            }))
          );
          this.assessmentId = inProgress.id;
          this.questions = mappedQuestions;
          this.restoreAnswers(inProgress.answers || []);
          this.loading = false;
          return;
        }

        // Si no vienen páginas en el listado, hacemos GET al assessment puntual
        this.loadQuestions(token, inProgress.id);
      },
      error: (error: any) => {
        this.statusMessage = `${error?.message || 'No se pudo recuperar el assessment pendiente.'}. Se usarán preguntas locales.`;
        console.error('Error listando assessments', error);
        this.loadFallbackQuestions();
      }
    });
  }

  selectOption(option: TestOption): void {
    const question = this.currentQuestion;
    if (!question) {
      return;
    }

    this.answersByQuestion[question.id] = option.id;
    this.answerValues[question.id] = option.value;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return;
    }

    this.submitTest();
  }

  goBack(): void {
    if (this.currentQuestionIndex === 0) {
      return;
    }

    this.currentQuestionIndex--;
  }

  submitTest(): void {
    if (this.usingFallback) {
      this.calculateResultsLocally();
      return;
    }

    const token = this.session.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.statusMessage = 'Procesando tus respuestas con IA...';
    this.resetInsights();
    this.topAreas = [];
    this.showResults = false;
    this.requestInsights();
  }

  private calculateResultsLocally(): void {
    const areaCounts: Record<string, number> = {};
    Object.values(this.answerValues).forEach((value) => {
      if (!value) {
        return;
      }

      areaCounts[value] = (areaCounts[value] || 0) + 1;
    });

    const sortedAreas = Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const areaNames: Record<string, string> = {
      ciencias: 'Ciencias e Investigación',
      artes: 'Artes y Creatividad',
      social: 'Trabajo Social y Humanidades',
      tecnologia: 'Tecnología e Informática',
      administracion: 'Administración y Liderazgo',
      investigacion: 'Investigación Académica',
      creativo: 'Trabajo Creativo',
      practico: 'Trabajo Práctico y Técnico'
    };

    this.topAreas = sortedAreas.map(([areaCode]) => areaNames[areaCode] ?? areaCode);
    this.showResults = true;
    this.saveTestAttempt();
    this.statusMessage = 'Resultados listos (modo local).';
    this.requestInsights();
  }

  private saveTestAttempt(): void {
    const attempt = {
      date: new Date().toISOString(),
      topAreas: [...this.topAreas]
    };

    const stored = localStorage.getItem('vocatio-test-attempts');
    const attempts = stored ? JSON.parse(stored) : [];
    attempts.push(attempt);
    localStorage.setItem('vocatio-test-attempts', JSON.stringify(attempts));
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  retakeTest(): void {
    this.prepareTest();
  }

  private requestInsights(): void {
    const answersPayload = this.questions
      .map((question) => {
        const optionId = this.answersByQuestion[question.id];
        const value = this.answerValues[question.id];
        if (!optionId || !value) {
          return null;
        }
        return {
          questionId: question.id,
          optionId,
          value
        };
      })
      .filter((item): item is { questionId: string; optionId: string; value: string } => Boolean(item));

    if (!answersPayload.length) {
      this.statusMessage = 'Debes responder todas las preguntas antes de continuar.';
      return;
    }

    const notes = this.opinionControl.value?.trim();
    this.opinionControl.disable();

    this.insightsLoading = true;
    this.insightsError = '';
    this.showResults = true;

    this.insightsService
      .generateVocationalInsights({
        answers: answersPayload,
        notes: notes || undefined
      })
      .subscribe({
        next: (response) => {
          this.insights = response;
          this.insightsLoading = false;
          this.assessmentId = response.assessmentId ?? this.assessmentId;
          this.statusMessage = '';
          this.fetchAssessmentResultFromServer();
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.insightsError = error.message;
          this.insightsLoading = false;
          this.statusMessage = 'No se pudieron generar insights con IA.';
          console.error('Error generando insights con DeepSeek', error);
          this.cdr.detectChanges();
        }
      });
  }

  private fetchAssessmentResultFromServer(): void {
    if (!this.assessmentId) {
      return;
    }
    const token = this.session.getAccessToken();
    if (!token) {
      return;
    }

    this.testService.fetchResult(this.assessmentId, token).subscribe({
      next: (result) => {
        this.submissionResult = result;
        this.topAreas = result.topAreas || [];
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        console.error('Error obteniendo resultados del assessment', error);
      }
    });
  }
}
