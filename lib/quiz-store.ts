import { create } from "zustand";
import { QuizState, ShuffledQuestion, WrongAnswer, Question } from "@/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QuizStore extends QuizState {
  setFan: (fan: string) => void;
  setMavzu: (mavzu: string) => void;
  startQuiz: (questions: Question[], count: number) => void;
  answer: (index: number) => { correct: boolean; correctIndex: number };
  nextQuestion: () => void;
  finishQuiz: () => void;
  updateTimer: () => void;
  reset: () => void;
}

const initialState: QuizState = {
  fan: null,
  mavzu: null,
  quiz: [],
  index: 0,
  score: 0,
  wrong: [],
  totalCount: 0,
  startTime: null,
  endTime: null,
  elapsedSeconds: 0,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  setFan: (fan) => set({ fan }),
  setMavzu: (mavzu) => set({ mavzu }),

  startQuiz: (questions, count) => {
    const pool = shuffle(questions).slice(0, count);
    const quiz: ShuffledQuestion[] = pool.map((q) => {
      const indexed = q.variantlar.map((v, i) => ({
        v,
        correct: i === q.javob,
        originalIndex: i,
      }));
      return { ...q, order: shuffle(indexed) };
    });

    const now = Date.now();
    set({
      quiz,
      index: 0,
      score: 0,
      wrong: [],
      totalCount: count,
      startTime: now,
      endTime: null,
      elapsedSeconds: 0,
    });
  },

  updateTimer: () => {
    const { startTime, endTime } = get();
    if (!startTime || endTime) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    set({ elapsedSeconds: elapsed });
  },

  finishQuiz: () => {
    const { startTime } = get();
    const now = Date.now();
    const elapsed = startTime ? Math.floor((now - startTime) / 1000) : 0;
    set({ endTime: now, elapsedSeconds: elapsed });
  },

  answer: (chosenIndex) => {
    const { quiz, index } = get();
    const q = quiz[index];
    const chosen = q.order[chosenIndex];
    const correctIndex = q.order.findIndex((o) => o.correct);

    if (chosen.correct) {
      set((s) => ({ score: s.score + 1 }));
    } else {
      const wrong: WrongAnswer = {
        savol: q.savol,
        sizniki: chosen.v,
        togri: q.order[correctIndex].v,
        izoh: q.izoh,
      };
      set((s) => ({ wrong: [...s.wrong, wrong] }));
    }

    return { correct: chosen.correct, correctIndex };
  },

  nextQuestion: () => set((s) => ({ index: s.index + 1 })),

  reset: () => set(initialState),
}));
