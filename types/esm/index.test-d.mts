/**
 * ESM-mode type-level regression test for the root entrypoint.
 *
 * The package is CommonJS, so `tsconfig.json` compiles the `types/*.test-d.ts` files in CJS
 * resolution mode and cannot observe ESM-only defects. This file is an ES module (`*.mts`,
 * compiled by `tsconfig.esm.json`), so it resolves the package through the exports map's
 * `import` condition and is the test that catches TS2349 ("this expression is not callable")
 * for the default import.
 *
 * Compiled by `npm run typecheck`; must produce zero errors. The `@ts-expect-error`
 * directives are the negative control - see types/index.test-d.ts for the rationale.
 */

import Snowball, { Snowball as NamedSnowball } from "@mlengse/snowball-js";
import type { Language, Stemmer } from "@mlengse/snowball-js";

// Root: the default import must be callable (this is the form the README documents).
const viaDefault: Stemmer = Snowball("english");
viaDefault.setCurrent("running");
viaDefault.stem();
const viaDefaultResult: string | null = viaDefault.getCurrent();

// Root: the named export must exist and be interchangeable with the default.
const viaNamed: Stemmer = NamedSnowball("english");
viaNamed.setCurrent("cats");
viaNamed.stem();
const viaNamedResult: string | null = viaNamed.getCurrent();

// Negative control: these must NOT compile. If they do, the declarations have degraded to
// `any` and the positive assertions above prove nothing.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaDefault.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaDefault.getCurrent();
// @ts-expect-error - "klingon" is not a supported Language
const badLanguage = Snowball("klingon");

export type RootEsmSurface = {
  viaDefaultResult: string | null;
  viaNamedResult: string | null;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
  badLanguage: typeof badLanguage;
};

// Language must remain exported and assignable.
export const someLanguage: Language = "german";
