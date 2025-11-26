export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  areaInteresId?: number | null;
  link?: string;
}

export interface RecommendationsResponse {
  message: string;
  resources: LearningResource[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: TestOption[];
}

export interface TestOption {
  id: string;
  text: string;
  value: string;
}

export interface TestSubmission {
  answers: string[];
}

export interface TestResult {
  id: string;
  userId: string;
  topAreas: string[];
  completedAt: string;
}

export interface VocationalInsightsPayload {
  answers: Array<{
    questionId: string;
    optionId: string;
    value: string;
  }>;
  notes?: string;
}

export interface VocationalInsights {
  mbtiProfile: string;
  suggestedCareers: string[];
  qualities?: string[];
  profileSummary: string;
}
