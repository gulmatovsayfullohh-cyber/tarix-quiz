export interface Question {
  id?: string;
  fan: string;
  mavzu: string;
  savol: string;
  variantlar: string[];
  javob: number;
  izoh: string;
  sinf?: number;
  isLocal?: boolean;
  isDeleted?: boolean;
}

export interface ShuffledQuestion extends Question {
  order: { v: string; correct: boolean; originalIndex: number }[];
}

export interface WrongAnswer {
  savol: string;
  sizniki: string;
  togri: string;
  izoh: string;
}

export interface QuizState {
  fan: string | null;
  mavzu: string | null;
  quiz: ShuffledQuestion[];
  index: number;
  score: number;
  wrong: WrongAnswer[];
  totalCount: number;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
}
