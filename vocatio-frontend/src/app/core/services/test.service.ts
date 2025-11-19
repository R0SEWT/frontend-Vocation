import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEST_ENDPOINTS } from '../constants/api.constants';
import { TestQuestion, TestSubmission, TestResult } from '../validators/models/learning.models';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) {}

  // Crear assessment/intento de test vocacional (retorna assessmentId)
  createAssessment(token: string): Observable<{ assessmentId: string }> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<{ assessmentId: string }>(TEST_ENDPOINTS.create, {}, { headers });
  }

  // Obtener preguntas usando el assessmentId
  fetchQuestions(assessmentId: string, token: string): Observable<TestQuestion[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<TestQuestion[]>(TEST_ENDPOINTS.questions(assessmentId), { headers });
  }

  // Enviar respuestas usando el assessmentId
  submitTest(assessmentId: string, token: string, submission: TestSubmission): Observable<TestResult> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<TestResult>(TEST_ENDPOINTS.submit(assessmentId), submission, { headers });
  }
}