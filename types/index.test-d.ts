/**
 * Type-level regression test for the CommonJS surface (root entrypoint).
 *
 * The package is CommonJS (no `"type": "module"`), so TypeScript resolves this file in CJS
 * mode against the `export =` declaration in `index.d.ts`. The ESM-side shape (a callable
 * default plus a matching named export, as actually loaded from `index.mjs`) is pinned
 * separately in types/esm/index.test-d.mts, because CJS resolution cannot observe it.
 *
 * Compiled by `npm run typecheck`; must produce zero errors. The `@ts-expect-error`
 * directives below are the negative control: if a declaration ever regressed to `any`
 * (making the file pass vacuously), those directives would become "unused" and tsc would
 * report an error. The test therefore cannot succeed for the wrong reason.
 */

import Snowball from "@mlengse/snowball-js";
import SnowballRequire = require("@mlengse/snowball-js");
import type { Language, Stemmer } from "@mlengse/snowball-js";

// Root: the default import must be a callable factory.
const viaDefault: Stemmer = Snowball("english");
viaDefault.setCurrent("running");
viaDefault.stem();
const viaDefaultResult: string | null = viaDefault.getCurrent();

// Root: the `import = require` form must be callable too.
const viaRequire: Stemmer = SnowballRequire("english");
viaRequire.setCurrent("cats");
viaRequire.stem();
const viaRequireResult: string | null = viaRequire.getCurrent();

// Negative control: these must NOT compile. If they do, the declarations have degraded to
// `any` and the positive assertions above prove nothing.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaDefault.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaDefault.getCurrent();
// @ts-expect-error - "klingon" is not a supported Language
const badLanguage = Snowball("klingon");

export type RootCjsSurface = {
  viaDefaultResult: string | null;
  viaRequireResult: string | null;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
  badLanguage: typeof badLanguage;
};

// Language and Stemmer must remain reachable from the CJS declaration.
export type LanguageIsExported = Language;
export const someLanguage: Language = "german";
