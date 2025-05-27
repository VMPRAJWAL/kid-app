
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GameMode, MathOperation, MathQuestion, LanguagePuzzle, WordMatchPair } from '../types';
import { GEMINI_TEXT_MODEL, MATH_OPERATIONS_BY_LEVEL, LANGUAGE_PUZZLE_THEMES_BY_LEVEL } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY is not set. Please ensure the environment variable API_KEY is configured.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if not set, but will fail API calls

function parseGeminiResponse<T,>(response: GenerateContentResponse): T | null {
  try {
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error, "Raw response:", response.text);
    return null;
  }
}

const generateMathPrompt = (level: number, operation: MathOperation): string => {
  let numRange = "1-10";
  let exampleQuestion = "3 + 5 = ?";
  let operationText = "addition";

  if (level === 2) numRange = "1-20";
  if (level === 3) {
    numRange = "1-10 for multipliers, 1-5 for multiplicands for multiplication; dividends up to 50 for division";
  }
  
  switch(operation) {
    case MathOperation.ADDITION: operationText = "addition"; exampleQuestion = `${level === 1 ? '3 + 5' : '12 + 7'} = ?`; break;
    case MathOperation.SUBTRACTION: operationText = "subtraction"; exampleQuestion = `${level === 1 ? '8 - 3' : '15 - 6'} = ?`; break;
    case MathOperation.MULTIPLICATION: operationText = "multiplication"; exampleQuestion = "3 x 4 = ?"; break;
    case MathOperation.DIVISION: operationText = "division (whole number result)"; exampleQuestion = "10 / 2 = ?"; break;
  }

  return `Generate a simple ${operationText} math question for a child (level ${level}, roughly age ${5 + level}).
Numbers involved should be in the range ${numRange}. Ensure the result is a whole number.
Provide the question as a string (e.g., "${exampleQuestion}"), the correct numerical answer as a string, and three distinct incorrect numerical answer options as strings.
The options should be plausible and one of them must be the correct answer.
Format the response as a single JSON object: { "questionText": "string", "correctAnswer": "string", "options": ["string", "string", "string", "string"] }.
Ensure options are shuffled and distinct. Example for ${operationText}: { "questionText": "${exampleQuestion}", "correctAnswer": "8", "options": ["6", "7", "8", "9"] }`;
};


const generateLanguagePrompt = (level: number, theme: string): string => {
  return `Generate a word matching puzzle for a child (level ${level}, roughly age ${5 + level}) learning English.
The theme is "${theme}". Provide three unique pairs. Each pair should have a term and its corresponding match.
Format the response as a single JSON object: 
{ 
  "promptText": "Match the ${theme.includes('color') ? 'object to its color' : theme.includes('sound') ? 'animal to its sound' : 'item to its pair'}:", 
  "pairs": [
    {"id": "pair1", "term": "string", "match": "string"}, 
    {"id": "pair2", "term": "string", "match": "string"}, 
    {"id": "pair3", "term": "string", "match": "string"}
  ] 
}.
Example for "common objects and their colors": { "promptText": "Match the object to its color:", "pairs": [{"id": "p1", "term": "Apple", "match": "Red"}, {"id": "p2", "term": "Banana", "match": "Yellow"}, {"id": "p3", "term": "Sky", "match": "Blue"}] }`;
};


export const generateGameContent = async (
  gameMode: GameMode,
  level: number
): Promise<MathQuestion | LanguagePuzzle | null> => {
  if (!API_KEY) {
    console.error("Gemini API key not available.");
    // Return mock data or specific error object if API key is missing
    if (gameMode === GameMode.MATH) {
        return { id: 'mockmath1', gameMode: GameMode.MATH, operation: MathOperation.ADDITION, questionText: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswer: '2' } as MathQuestion;
    } else {
        return { id: 'mocklang1', gameMode: GameMode.LANGUAGE, puzzleType: 'WORD_MATCH', promptText: 'Match a fruit to its color:', pairs: [{id: 'p1', term: 'Apple', match: 'Red'}, {id: 'p2', term: 'Banana', match: 'Yellow'}], terms: ['Apple', 'Banana'], matches: ['Red', 'Yellow']} as LanguagePuzzle;
    }
  }

  let prompt = '';
  let parsedResponse: any = null;

  try {
    if (gameMode === GameMode.MATH) {
      const operations = MATH_OPERATIONS_BY_LEVEL[level] || MATH_OPERATIONS_BY_LEVEL[1];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      prompt = generateMathPrompt(level, operation);
      const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
      parsedResponse = parseGeminiResponse<{ questionText: string; correctAnswer: string; options: string[] }>(response);
      if (parsedResponse) {
        return {
          id: `math-${Date.now()}`,
          gameMode: GameMode.MATH,
          operation,
          ...parsedResponse,
        } as MathQuestion;
      }
    } else if (gameMode === GameMode.LANGUAGE) {
      const themes = LANGUAGE_PUZZLE_THEMES_BY_LEVEL[level] || LANGUAGE_PUZZLE_THEMES_BY_LEVEL[1];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      prompt = generateLanguagePrompt(level, theme);
      const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
      parsedResponse = parseGeminiResponse<{ promptText: string; pairs: WordMatchPair[] }>(response);
      if (parsedResponse && parsedResponse.pairs && parsedResponse.pairs.length > 0) {
        const terms = parsedResponse.pairs.map(p => p.term);
        // Shuffle matches for display
        const matches = [...parsedResponse.pairs.map(p => p.match)].sort(() => Math.random() - 0.5);
        return {
          id: `lang-${Date.now()}`,
          gameMode: GameMode.LANGUAGE,
          puzzleType: 'WORD_MATCH',
          ...parsedResponse,
          terms,
          matches,
        } as LanguagePuzzle;
      }
    }
  } catch (error) {
    console.error("Error generating game content with Gemini:", error);
    console.error("Prompt used:", prompt);
    return null;
  }
  
  console.error("Failed to generate or parse content from Gemini. Parsed response:", parsedResponse, "Prompt:", prompt);
  return null;
};
