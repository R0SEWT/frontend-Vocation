export interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: UserSummary;
  tokens: Tokens;
}

export interface RegisterPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  confirmation: string;
  currentPassword: string;
}
