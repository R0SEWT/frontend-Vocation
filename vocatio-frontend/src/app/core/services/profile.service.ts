import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROFILE_ENDPOINTS } from '../constants/api.constants';
import { ProfilePatchPayload, ProfileUpdatePayload, UserProfile } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  fetchProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(PROFILE_ENDPOINTS.me);
  }

  updateProfile(payload: ProfileUpdatePayload): Observable<{ message: string; profile: UserProfile }> {
    return this.http.put<{ message: string; profile: UserProfile }>(PROFILE_ENDPOINTS.me, payload);
  }

  patchPersonalData(payload: ProfilePatchPayload): Observable<{ message: string; profile: UserProfile }> {
    return this.http.patch<{ message: string; profile: UserProfile }>(PROFILE_ENDPOINTS.me, payload);
  }
}
