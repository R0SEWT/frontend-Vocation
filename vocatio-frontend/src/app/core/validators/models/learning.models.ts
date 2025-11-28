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

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
}

export interface TestSubmission {
  answers: AssessmentAnswer[];
}

export interface TestResult {
  id?: string;
  assessmentId?: string;
  userId?: string;
  topAreas: string[];
  suggestedCareers?: string[];
  chart?: unknown;
  completedAt?: string;
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
  assessmentId?: string;
  mbtiProfile: string;
  suggestedCareers: string[];
  qualities?: string[];
  profileSummary: string;
}
