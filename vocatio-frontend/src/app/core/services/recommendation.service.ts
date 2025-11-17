import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEST_ENDPOINTS } from '../constants/api.constants';
import { RecommendationsResponse } from '../models/learning.models';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient) {}

  fetchByInterest(areaIds: string, page = 0, size = 5): Observable<RecommendationsResponse> {
    const params = new HttpParams()
      .set('areaIds', areaIds)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecommendationsResponse>(TEST_ENDPOINTS.recommendations, { params });
  }
}
