// PROTOTYPE (not applied to source). CJS-format per-language declaration.
declare function EnglishStemmer(): EnglishStemmer.Stemmer;

declare namespace EnglishStemmer {
  interface Stemmer {
    setCurrent(word: string): void;
    getCurrent(): string | null;
    stem(): boolean;
  }
}

export = EnglishStemmer;
