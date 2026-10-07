/**
 * Type-level regression test for the per-language bundles.
 *
 * Guards the drift where each dist/languages/*.mjs exported a named binding
 * (`export { EnglishStemmer }`) that the generated .d.ts omitted, so
 * `import { EnglishStemmer } from '@mlengse/snowball-js/english'` was rejected
 * by TypeScript despite working at runtime.
 *
 * Compiled by `npm run typecheck`; must produce zero errors. The
 * `@ts-expect-error` directives are the negative control - see
 * index.test-d.ts for the rationale.
 */

import EnglishStemmer, { EnglishStemmer as NamedEnglishStemmer } from "../dist/languages/english.js";
import type { Stemmer } from "../dist/languages/english.js";

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

// Stemmer is exported as a type from the per-language bundle (this was the
// claim the original follow-up made wrongly - verified true, now pinned).
const typed: Stemmer = viaNamed;

// Negative control: these must NOT compile, so the positive assertions above
// cannot pass vacuously via `any`.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaNamed.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaNamed.getCurrent();

export type PerLanguageSurface = {
  viaDefaultResult: string | null;
  viaNamedResult: string | null;
  formsAgree: boolean;
  typed: Stemmer;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
};
