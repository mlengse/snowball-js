export interface Stemmer {
  setCurrent(word: string): void;
  getCurrent(): string | null;
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
