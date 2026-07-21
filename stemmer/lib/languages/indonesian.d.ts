export interface Stemmer {
  setCurrent(word: string): void;
  getCurrent(): string | null;
  stem(): boolean;
}

export default function IndonesianStemmer(): Stemmer;
