import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AI_ENDPOINTS } from '../constants/api.constants';
import { VocationalInsights, VocationalInsightsPayload } from '../validators/models/learning.models';

@Injectable({ providedIn: 'root' })
export class InsightsService {
  constructor(private http: HttpClient) {}

  generateVocationalInsights(payload: VocationalInsightsPayload): Observable<VocationalInsights> {
    return this.http.post<VocationalInsights>(AI_ENDPOINTS.vocationalInsights, payload);
  }
}
