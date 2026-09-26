export const DIFFICULTY = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
};

export const DIFFICULTY_COLORS = {
  [DIFFICULTY.EASY]: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  [DIFFICULTY.MEDIUM]: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  [DIFFICULTY.HARD]: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

export const LANGUAGES = [
  { id: 'java', name: 'Java 17 (OpenJDK)', ext: 'java' },
  { id: 'cpp', name: 'C++ 17 (G++)', ext: 'cpp' },
  { id: 'python', name: 'Python 3.10', ext: 'py' },
];

export const SUBMISSION_STATUS = {
  ACCEPTED: 'ACCEPTED',
  WRONG_ANSWER: 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED: 'TIME_LIMIT_EXCEEDED',
  COMPILATION_ERROR: 'COMPILATION_ERROR',
  PENDING: 'PENDING',
};
