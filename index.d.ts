export interface Stemmer {
  /** Sets the word to be stemmed. */
  setCurrent(word: string): void;
  /** Returns the stemmed word, or null if called again without setCurrent. */
  getCurrent(): string | null;
  /** Performs stemming on the current word. Returns true if stemming occurred. Call getCurrent() to retrieve the result. */
  stem(): boolean;
}

export type Language =
  | "danish"
  | "dutch"
  | "english"
  | "finnish"
  | "french"
  | "german"
  | "hungarian"
  | "indonesian"
  | "italian"
  | "norwegian"
  | "portuguese"
  | "romanian"
  | "russian"
  | "spanish"
  | "swedish"
  | "turkish";

declare function Snowball(language: Language): Stemmer;

export default Snowball;
