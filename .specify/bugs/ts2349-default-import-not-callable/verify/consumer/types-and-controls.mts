// Types must be reachable from both conditions, and the negative controls must not compile
// (if they do, the declarations have degraded to `any` and the matrix proves nothing).
import Snowball from "@mlengse/snowball-js";
import type { Language, Stemmer } from "@mlengse/snowball-js";
import type { Stemmer as EnglishStemmerType } from "@mlengse/snowball-js/english";

export const language: Language = "german";
export const stemmer: Stemmer = Snowball("english");
export const viaEnglishType: EnglishStemmerType = stemmer;

// @ts-expect-error - bogusMethod is not part of Stemmer
export const bogus = stemmer.bogusMethod();
// @ts-expect-error - "klingon" is not a supported Language
export const bad: Language = "klingon";
