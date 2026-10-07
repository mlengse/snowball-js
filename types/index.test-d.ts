/**
 * Type-level regression test.
 *
 * Guards the drift where the runtime ESM modules exported a named binding
 * (`export { Snowball }`) that index.d.ts failed to declare, so TypeScript
 * rejected named imports that worked correctly at runtime.
 *
 * Compiled by `npm run typecheck`; must produce zero errors. The
 * `@ts-expect-error` directives below are the negative control: if a declaration
 * ever regressed to `any` (making the file pass vacuously), those directives
 * would become "unused" and tsc would report an error. The test therefore
 * cannot succeed for the wrong reason.
 */

import Snowball, { Snowball as NamedSnowball } from "../index.js";
import type { Language, Stemmer } from "../index.js";

// Root: the default import remains the documented form.
const viaDefault: Stemmer = Snowball("english");
viaDefault.setCurrent("running");
viaDefault.stem();
const rootResult: string | null = viaDefault.getCurrent();

// Root: the named export must exist and be interchangeable with the default.
const viaNamed: Stemmer = NamedSnowball("english");
viaNamed.setCurrent("cats");
viaNamed.stem();
const viaNamedResult: string | null = viaNamed.getCurrent();

// Negative control: these must NOT compile. If they do, the declarations have
// degraded to `any` and the positive assertions above prove nothing.
// @ts-expect-error - `bogusMethod` is not part of the Stemmer interface
const bogusMember = viaDefault.bogusMethod();
// @ts-expect-error - getCurrent() returns `string | null`, not `number`
const wrongType: number = viaDefault.getCurrent();
// @ts-expect-error - "klingon" is not a supported Language
const badLanguage = Snowball("klingon");

export type RootSurface = {
  rootResult: string | null;
  viaNamedResult: string | null;
  bogusMember: typeof bogusMember;
  wrongType: typeof wrongType;
  badLanguage: typeof badLanguage;
};

// Language must remain exported and assignable.
export type LanguageIsExported = Language;
export const someLanguage: Language = "german";