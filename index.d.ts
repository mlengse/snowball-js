/**
 * CommonJS declaration for the `require` resolution condition.
 *
 * The runtime for this condition is `dist/Snowball.js`, a CommonJS module that does
 * `module.exports = Snowball`. Under `nodenext` TypeScript classifies a `.d.ts` in a
 * CommonJS package as a CommonJS module, so the callable is described with `export =`
 * and its types are re-exported through a merged namespace. The ESM shape lives in
 * `index.d.mts`, wired to the `import` condition.
 */

declare function Snowball(language: Snowball.Language): Snowball.Stemmer;

declare namespace Snowball {
  interface Stemmer {
    /** Sets the word to be stemmed. */
    setCurrent(word: string): void;
    /** Returns the stemmed word, or null if called again without setCurrent. */
    getCurrent(): string | null;
    /** Performs stemming on the current word. Returns true if stemming occurred. Call getCurrent() to retrieve the result. */
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
