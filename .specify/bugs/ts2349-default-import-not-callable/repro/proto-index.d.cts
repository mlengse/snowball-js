// PROTOTYPE (not applied to source). CJS-format declaration: export = a callable,
// with a merged namespace so the types stay reachable (Snowball.Stemmer / Snowball.Language).
declare function Snowball(language: Snowball.Language): Snowball.Stemmer;

declare namespace Snowball {
  interface Stemmer {
    setCurrent(word: string): void;
    getCurrent(): string | null;
    stem(): boolean;
  }

  type Language =
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
}

export = Snowball;
