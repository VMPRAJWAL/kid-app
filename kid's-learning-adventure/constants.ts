import { MathOperation, GameMode } from './types';

export const APP_NAME = "Kid's Learning Adventure";
export const INITIAL_STARS = 0;
export const QUESTIONS_TO_LEVEL_UP = 3; // Number of correct answers to level up
export const MAX_LEVEL = 3; // Simplified max level

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const MATH_OPERATIONS_BY_LEVEL: { [level: number]: MathOperation[] } = {
  1: [MathOperation.ADDITION, MathOperation.SUBTRACTION], // Numbers 1-10 for addition, simple subtraction
  2: [MathOperation.ADDITION, MathOperation.SUBTRACTION], // Numbers 1-20 for addition, subtraction with larger numbers
  3: [MathOperation.MULTIPLICATION, MathOperation.DIVISION], // Simple mult (e.g., 2x3, 5x4), simple division
};

export const LANGUAGE_PUZZLE_THEMES_BY_LEVEL: { [level: number]: string[] } = {
  1: ['common objects and their colors'],
  2: ['animals and their sounds'],
  3: ['simple action verbs and objects'],
};

export const BUTTON_COLORS = [
  'bg-blue-500 hover:bg-blue-600',
  'bg-red-500 hover:bg-red-600',
  'bg-yellow-500 hover:bg-yellow-600',
  'bg-green-500 hover:bg-green-600',
];

export const TERM_BUTTON_COLOR = 'bg-indigo-500 hover:bg-indigo-600';
export const MATCH_BUTTON_COLOR = 'bg-pink-500 hover:bg-pink-600';

export const LEVEL_DESCRIPTIONS: { [key in GameMode]?: { [level: number]: string } } = {
  [GameMode.MATH]: {
    1: "Level 1: Easy Sums & Differences (1-10)",
    2: "Level 2: More Sums & Differences (1-20)",
    3: "Level 3: Fun Multiplication & Division",
  },
  [GameMode.LANGUAGE]: {
    1: "Level 1: Colors & Objects",
    2: "Level 2: Animal Sounds",
    3: "Level 3: Actions & Things",
  }
};