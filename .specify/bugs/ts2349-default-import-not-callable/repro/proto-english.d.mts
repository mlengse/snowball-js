// PROTOTYPE (not applied to source). ESM-format per-language declaration.
export interface Stemmer {
  setCurrent(word: string): void;
  getCurrent(): string | null;
  stem(): boolean;
}

declare function EnglishStemmer(): Stemmer;

export default EnglishStemmer;
export { EnglishStemmer };
