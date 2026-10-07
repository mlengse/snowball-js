/**
 * ES module declaration for the `import` resolution condition.
 *
 * The runtime for this condition is `index.mjs`, a genuine ES module that provides both a
 * default export and a named `Snowball` export. This file is referenced only by the
 * `import` condition's `types`; the CommonJS shape lives in `index.d.ts`.
 */

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
export { Snowball };
