import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizConfig, QuizState, Question } from "./quiz-types";
import * as he from "he";

// Shuffle array function "Fisher–Yates"
// it gets random number and swaps it with the last element
// then it decrements the length of the array and repeats
// until the array is shuffled
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      loading: false,
      error: null,
      currentQuestionIndex: 0,
      score: 0,
      categories: [],
      userAnswers: [],
      quizConfig: {
        amount: 3,
        category: "",
        difficulty: "",
        type: "",
      },
      quizStarted: false,
      quizFinished: false,

      fetchQuestions: async () => {
        const { quizConfig } = get();
        set({
          loading: true,
          error: null,
          quizStarted: true,
          quizFinished: false,
        });

        try {
          let url = `https://opentdb.com/api.php?amount=${quizConfig.amount}&`;

          if (quizConfig.category) {
            url += `&category=${quizConfig.category}`;
          }

          if (quizConfig.difficulty) {
            url += `&difficulty=${quizConfig.difficulty}`;
          }

          if (quizConfig.type) {
            url += `&type=${quizConfig.type}`;
          }

          const firstresponse = await fetch(url);
          const response = await firstresponse.json();
          if (response.response_code === 0) {
            const processedQuestions = response.results.map((q: Question) => ({
              ...q,
              question: he.decode(q.question),
              correct_answer: he.decode(q.correct_answer),
              incorrect_answers: q.incorrect_answers.map((a) => he.decode(a)),
              all_answers: shuffleArray([
                he.decode(q.correct_answer),
                ...q.incorrect_answers.map((a) => he.decode(a)),
              ]),
              correct_answers: [he.decode(q.correct_answer)],
            }));

            set({
              questions: processedQuestions,
              loading: false,
              currentQuestionIndex: 0,
              score: 0,
              userAnswers: [],
            });
          } else {
            set({
              error: "Failed to fetch questions. Please try different options.",
              loading: false,
              quizStarted: false,
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred while fetching questions.";
          if ((error as any).response.response_code === 5) {
            set({
              error: "Wait a moment before trying again.",
              loading: false,
            });
          } else {
            set({
              error: errorMessage,
              loading: false,
            });
          }
        }
      },

      setQuizConfig: (config: Partial<QuizConfig>) => {
        set((state: QuizState) => ({
          quizConfig: { ...state.quizConfig, ...config },
        }));
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set((state: QuizState) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
          }));
        } else {
          set({ quizFinished: true });
        }
      },

      submitAnswer: (answer: string) => {
        const {
          currentQuestionIndex,
          questions,
          userAnswers,
          score,
          setCategories,
        } = get();
        const currentQuestion = questions[currentQuestionIndex];

        const updatedUserAnswers = [...userAnswers, answer];

        const isCorrect = currentQuestion.correct_answer === answer;

        set({
          userAnswers: updatedUserAnswers,
          score: isCorrect ? score + 1 : score,
        });
        setCategories(currentQuestion.category, isCorrect);
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: [],
          quizStarted: false,
          quizFinished: false,
          questions: [],
          categories: [],
          quizConfig: {
            ...get().quizConfig,
            category: "",
            difficulty: "",
            type: "",
          },
        });
      },

      setCategories: (category: string, isCorrect: boolean) => {
        const { categories } = get();

        if (!categories.find((c) => c.name === category)) {
          set((state) => ({
            categories: [
              ...state.categories,
              { name: category, count: 1, isCorrect: isCorrect ? 1 : 0 },
            ],
          }));
        } else {
          set((state) => ({
            categories: state.categories.map((c) =>
              c.name === category
                ? {
                    ...c,
                    count: c.count + 1,
                    isCorrect: isCorrect ? c.isCorrect + 1 : c.isCorrect,
                  }
                : c
            ),
          }));
        }
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
        userAnswers: state.userAnswers,
        quizConfig: state.quizConfig,
        quizStarted: state.quizStarted,
        quizFinished: state.quizFinished,
      }),
    }
  )
);
