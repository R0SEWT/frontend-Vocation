export const API_BASE_URL = 'https://vocatio.onrender.com/api';
export const API_V1_BASE_URL = `${API_BASE_URL}/v1`;

export const AUTH_ENDPOINTS = {
  register: `${API_V1_BASE_URL}/auth/register`,
  login: `${API_V1_BASE_URL}/auth/login`,
  changePassword: `${API_V1_BASE_URL}/auth/change-password`
};

export const PROFILE_ENDPOINTS = {
  me: `${API_V1_BASE_URL}/users/me`
};

export const TEST_ENDPOINTS = {
  create: `${API_V1_BASE_URL}/assessments`, // POST: crea el test/intento para el usuario
  questions: (assessmentId: string) => `${API_V1_BASE_URL}/assessments/${assessmentId}`,
  submit: (assessmentId: string) => `${API_V1_BASE_URL}/assessments/${assessmentId}/submit`,
  result: (assessmentId: string) => `${API_V1_BASE_URL}/assessments/${assessmentId}/result`,
  recommendations: `${API_V1_BASE_URL}/recommendations`
};

export const AI_ENDPOINTS = {
  vocationalInsights: `${API_V1_BASE_URL}/ai/deepseek` // Proxy que conversa con DeepSeek para generar el perfil
};
