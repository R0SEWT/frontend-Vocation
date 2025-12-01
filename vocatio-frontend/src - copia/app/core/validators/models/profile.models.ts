export interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  age?: number;
  grade?: string;
  gradeLabel?: string;
  interests: string[];
  preferences?: Record<string, boolean>;
}

export interface ProfileUpdatePayload {
  age: number;
  grade: string;
  interests: string[];
}

export interface ProfilePatchPayload {
  name: string;
  preferences: Record<string, boolean>;
}

export interface AccountDeletionPayload {
  confirmation: string;
  currentPassword: string;
}

export interface AccountDeletionResponse {
  message: string;
  pendingDeletion: boolean;
}
