export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[]; // Holds shuffled answers
  correct_answers?: string[];
}

export interface QuizConfig {
  amount: number;
  category: string;
  difficulty: string;
  type: string;
}

export interface QuizState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  score: number;
  userAnswers: string[];
  quizConfig: QuizConfig;
  quizStarted: boolean;
  quizFinished: boolean;
  categories: { name: string; count: number; isCorrect: number }[];
  // Actions
  fetchQuestions: () => Promise<void>;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  nextQuestion: () => void;
  submitAnswer: (answer: string) => void;
  resetQuiz: () => void;
  setCategories: (category: string, isCorrect: boolean) => void;
}
