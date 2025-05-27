
export enum GameView {
  MENU = 'menu',
  GAME = 'game',
}

export enum GameMode {
  MATH = 'math',
  LANGUAGE = 'language',
}

export enum MathOperation {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}

export interface MathQuestion {
  id: string;
  gameMode: GameMode.MATH;
  operation: MathOperation;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface WordMatchPair {
  id: string;
  term: string;
  match: string;
}

export interface LanguagePuzzle {
  id: string;
  gameMode: GameMode.LANGUAGE;
  puzzleType: 'WORD_MATCH';
  promptText: string;
  pairs: WordMatchPair[]; // These are the correct pairs
  terms: string[]; // Terms to display on one side
  matches: string[]; // Matches to display on the other side (shuffled)
}

export type GameContent = MathQuestion | LanguagePuzzle;

export interface Score {
  stars: number;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of chunks can be added if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}
