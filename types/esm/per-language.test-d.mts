/**
 * ESM-mode type-level regression test for a generated per-language bundle.
 *
 * Compiled by `tsconfig.esm.json` (see types/esm/index.test-d.mts for why an ESM-mode
 * compilation is required). Pins that the per-language default import is callable and that
 * the named export exists, both resolved through the exports map's `import` condition.
 */

import EnglishStemmer, { EnglishStemmer as NamedEnglishStemmer } from "@mlengse/snowball-js/english";
import type { Stemmer } from "@mlengse/snowball-js/english";

// Per-language: default import (documented form) returns a Stemmer.
const viaDefault: Stemmer = EnglishStemmer();
viaDefault.setCurrent("running");
viaDefault.stem();
const viaDefaultResult: string | null = viaDefault.getCurrent();

// Per-language: the named export must exist and behave identically.
const viaNamed: Stemmer = NamedEnglishStemmer();
viaNamed.setCurrent("running");
viaNamed.stem();
const viaNamedResult: string | null = viaNamed.getCurrent();

// The two forms must agree.
const formsAgree: boolean = viaDefaultResult === viaNamedResult;

// Negative control: these must NOT compile, so the positive assertions above cannot pass
// vacuously via `any`.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaNamed.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaNamed.getCurrent();

export type PerLanguageEsmSurface = {
  viaDefaultResult: string | null;
  viaNamedResult: string | null;
  formsAgree: boolean;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
};
