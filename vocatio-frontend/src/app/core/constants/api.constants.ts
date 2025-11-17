export const API_BASE_URL = 'http://localhost:8080';

export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  changePassword: `${API_BASE_URL}/auth/change-password`
};

export const PROFILE_ENDPOINTS = {
  me: `${API_BASE_URL}/users/me`
};

export const TEST_ENDPOINTS = {
  recommendations: `${API_BASE_URL}/api/learning-resources/by-interests`
};
