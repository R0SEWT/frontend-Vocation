import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TEST_ENDPOINTS } from '../constants/api.constants';
import { AssessmentAnswer, TestQuestion, TestSubmission, TestResult } from '../validators/models/learning.models';

interface ApiAssessmentOption {
  id: string;
  label: string;
}

interface ApiAssessmentQuestion {
  id: string;
  title: string;
  required: boolean;
  options: ApiAssessmentOption[];
}

interface ApiAssessmentPage {
  page: number;
  questions: ApiAssessmentQuestion[];
}

interface ApiAssessmentResponse {
  id: string;
  status: string;
  progress?: {
    currentPage: number;
    totalPages: number;
    answeredQuestions: number;
    totalQuestions: number;
  };
  pages: ApiAssessmentPage[];
  answers: unknown[];
  features?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface AssessmentSummary {
  id: string;
  status: string;
  progress?: {
    currentPage: number;
    totalPages: number;
    answeredQuestions: number;
    totalQuestions: number;
  };
  pages?: ApiAssessmentPage[];
  answers?: AssessmentAnswer[];
  features?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) {}

  // Crear assessment/intento de test vocacional (retorna assessmentId)
  createAssessment(token: string): Observable<{ assessmentId: string }> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<{ assessmentId?: string; id?: string }>(TEST_ENDPOINTS.create, {}, { headers }).pipe(
      map((response) => ({ assessmentId: response.assessmentId ?? response.id ?? '' })),
      catchError((error) => {
        console.error('createAssessment failed', error);
        return throwError(() => error);
      })
    );
  }

  // Listar assessments del usuario
  listAssessments(token: string): Observable<AssessmentSummary[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<AssessmentSummary[]>(TEST_ENDPOINTS.create, { headers });
  }

  // Obtener preguntas usando el assessmentId
  fetchQuestions(assessmentId: string, token: string): Observable<{ questions: TestQuestion[]; answers: AssessmentAnswer[] }> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<ApiAssessmentResponse>(TEST_ENDPOINTS.questions(assessmentId), { headers }).pipe(
      map((assessment: any) => {
        // El backend puede responder con un arreglo (GET /assessments) o con un único assessment (GET /assessments/{id})
        const normalized: ApiAssessmentResponse | undefined = Array.isArray(assessment)
          ? (assessment.find((item: any) => item.id === assessmentId) ?? assessment[0])
          : assessment;

        if (!normalized || !normalized.pages?.length) {
          return { questions: [], answers: [] };
        }

        const questions = normalized.pages.flatMap((page) =>
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
        const answers = (normalized.answers as AssessmentAnswer[]) || [];
        return { questions, answers };
      }),
      catchError((error) => {
        console.error('fetchQuestions failed', error);
        return throwError(() => error);
      })
    );
  }

  // Enviar respuestas usando el assessmentId
  submitTest(assessmentId: string, token: string, submission: TestSubmission): Observable<TestResult> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<TestResult>(TEST_ENDPOINTS.submit(assessmentId), submission, { headers });
  }

  // Obtener resultados calculados de un assessment
  fetchResult(assessmentId: string, token: string): Observable<TestResult> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<TestResult>(TEST_ENDPOINTS.result(assessmentId), { headers });
  }
}
