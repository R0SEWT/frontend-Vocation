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
