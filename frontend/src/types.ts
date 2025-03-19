export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
}

export interface Answer {
  questionId: string;
  text: string;
}

export interface AssessmentResult {
  similarityScore: number;
  grammarScore: number;
  sentimentMatch: number;
  finalScore: number;
}

export type UserRole = 'teacher' | 'student';

// Mock data for development
export const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    correctAnswer: 'Paris is the capital of France.',
  },
  {
    id: '2',
    text: 'Explain the process of photosynthesis.',
    correctAnswer: 'Photosynthesis is the process by which plants convert sunlight into energy.',
  },
];