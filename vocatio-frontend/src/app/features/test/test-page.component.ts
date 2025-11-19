import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestOption, TestQuestion, TestResult, TestSubmission } from '../../core/models/learning.models';
import { SessionService } from '../../core/services/session.service';
import { TestService } from '../../core/services/test.service';
import { testPageStyles } from './test-page.styles';

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
  imports: [CommonModule],
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

      <p class="status" *ngIf="statusMessage">{{ statusMessage }}</p>

      <div class="test-progress" *ngIf="!loading && !showResults && questions.length">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>
        <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <div class="loading-section" *ngIf="loading">
        <div class="loading-card">
          <p>Cargando preguntas...</p>
        </div>
      </div>

      <section class="question-section" *ngIf="!loading && !showResults && currentQuestion">
        <div class="question-card">
          <div class="question-header">
            <span class="question-icon">💭</span>
            <h2>{{ currentQuestion.question }}</h2>
          </div>
          <div class="options-grid">
            <button
              class="option-button"
              type="button"
              *ngFor="let option of currentQuestion.options"
              [class.selected]="answersByQuestion[currentQuestion.id] === option.id"
              (click)="selectOption(option)"
            >
              {{ option.text }}
            </button>
          </div>
        </div>
      </section>

      <div class="actions-section" *ngIf="!loading && !showResults && currentQuestion">
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

      <section class="results-card" *ngIf="!loading && showResults">
        <h2>¡Test completado!</h2>
        <p>Estas son tus áreas principales según tus respuestas:</p>
        <div class="results-summary">
          <h3>Áreas recomendadas:</h3>
          <ul>
            <li *ngFor="let area of topAreas">{{ area }}</li>
          </ul>
        </div>
        <div class="results-actions">
          <button class="primary-action" type="button" (click)="goToHome()">Ver recomendaciones</button>
          <button class="secondary-action" type="button" (click)="retakeTest()">Repetir test</button>
        </div>
      </section>

      <p class="empty" *ngIf="!loading && !showResults && !questions.length">
        No hay preguntas disponibles en este momento.
      </p>
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

  constructor(
    private testService: TestService,
    private session: SessionService,
    private router: Router
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

    this.testService.createAssessment(token).subscribe({
      next: ({ assessmentId }) => this.loadQuestions(token, assessmentId),
      error: (error: Error) => {
        this.statusMessage = `${error.message}. Se usarán preguntas locales.`;
        this.loadFallbackQuestions();
      }
    });
  }

  private loadQuestions(token: string, assessmentId: string): void {
    this.assessmentId = assessmentId;
    this.testService.fetchQuestions(assessmentId, token).subscribe({
      next: (questions) => {
        if (!questions.length) {
          this.statusMessage = 'No se encontraron preguntas oficiales.';
          this.loadFallbackQuestions();
          return;
        }
        this.questions = questions;
        this.loading = false;
      },
      error: (error: Error) => {
        this.statusMessage = `${error.message}. Se usarán preguntas locales.`;
        this.loadFallbackQuestions();
      }
    });
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

    if (!this.assessmentId) {
      this.statusMessage = 'No se pudo identificar el intento actual.';
      return;
    }

    const submission: TestSubmission = {
      answers: this.questions.map((question) => this.answersByQuestion[question.id])
    };

    this.statusMessage = 'Enviando tus respuestas...';

    this.testService.submitTest(this.assessmentId, token, submission).subscribe({
      next: (result) => {
        this.submissionResult = result;
        this.topAreas = result.topAreas;
        this.showResults = true;
        this.statusMessage = 'Resultados listos.';
      },
      error: (error: Error) => {
        this.statusMessage = `${error.message}. Se mostrarán resultados locales.`;
        this.calculateResultsLocally();
      }
    });
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
}
