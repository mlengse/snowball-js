/**
 * Type-level regression test for the CommonJS surface of a generated per-language bundle.
 *
 * Compiled by `tsconfig.json` in CJS resolution mode against the generated `export =`
 * declaration. The ESM-side shape is pinned in types/esm/per-language.test-d.mts.
 */

import EnglishStemmer from "@mlengse/snowball-js/english";
import EnglishStemmerRequire = require("@mlengse/snowball-js/english");
import type { Stemmer } from "@mlengse/snowball-js/english";

// Per-language: default import (CJS interop) returns a Stemmer.
const viaDefault: Stemmer = EnglishStemmer();
viaDefault.setCurrent("running");
viaDefault.stem();
const viaDefaultResult: string | null = viaDefault.getCurrent();

// Per-language: the `import = require` form returns a Stemmer.
const viaRequire: Stemmer = EnglishStemmerRequire();
viaRequire.setCurrent("running");
viaRequire.stem();
const viaRequireResult: string | null = viaRequire.getCurrent();

// The two forms must agree.
const formsAgree: boolean = viaDefaultResult === viaRequireResult;

// Negative control: these must NOT compile, so the positive assertions above cannot pass
// vacuously via `any`.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaDefault.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaDefault.getCurrent();

export type PerLanguageCjsSurface = {
  viaDefaultResult: string | null;
  viaRequireResult: string | null;
  formsAgree: boolean;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
};
