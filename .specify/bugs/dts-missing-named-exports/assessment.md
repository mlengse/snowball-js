# Bug Assessment: TypeScript declarations omit the named exports that exist at runtime

- **Slug**: dts-missing-named-exports
- **Created**: 2026-10-07T18:32:00Z
- **Source**: pasted text — "bereskan follow-up Stemmer interface di per-language .d.ts"
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

Follow-up raised during `snowball-factory-constructor-mismatch`: the per-language `.d.ts`
files were believed to omit the `Stemmer` interface that the README's TypeScript example
imports. On investigation that specific claim is **false** — see "Retracted Premise"
below. However, verifying it surfaced a distinct, genuine defect in the same area: the
hand-written and generated declaration files do not declare the named exports that the
runtime ESM modules actually provide.

## Retracted Premise

The originating follow-up read:

> Per-language imports are fully typed: `import EnglishStemmer, { Stemmer } from
> '@mlengse/snowball-js/english';`

recorded in `snowball-factory-constructor-mismatch/fix.md` as an unverified observation.

**This is not a defect.** `dist/languages/english.d.ts` declares
`export interface Stemmer`, and the README example compiles clean under
`tsc 5.9.3` with `strict` + `module/moduleResolution: nodenext`. Verified against the real
`1.0.2` tarball installed into a scratch project; `--traceResolution` confirms
`exports["./english"].import.types` → `dist/languages/english.d.ts`. A negative control
(`s.bogusMethod()`, `const n: number = s.getCurrent()`) errored as expected, proving the
declarations are genuinely loaded rather than degrading to `any`.

`fix.md` for the prior bug carries this claim and should be amended to retract it.

## Symptom

`index.mjs` and every `dist/languages/*.mjs` export a named binding alongside the default
(`['Snowball', 'default']` and `['EnglishStemmer', 'default']` respectively), but the
corresponding `.d.ts` files declare only `export default`. TypeScript therefore rejects
named-import forms that are valid JavaScript and work correctly at runtime.

## Reproduction

1. `npm pack` (or install `@mlengse/snowball-js@1.0.2`) into a scratch project with
   `typescript@5.9.3` and `module`/`moduleResolution: nodenext`.
2. Write `import { Snowball } from "@mlengse/snowball-js";`.
3. Run `npx tsc --noEmit`.
4. Observed: `error TS2614: Module '"@mlengse/snowball-js"' has no exported member 'Snowball'. Did you mean to use 'import Snowball from "@mlengse/snowball-js"' instead?`
5. Repeat with `import { EnglishStemmer } from "@mlengse/snowball-js/english";` →
   `error TS2614: Module '"@mlengse/snowball-js/english"' has no exported member 'EnglishStemmer'.`
6. Control: `node --input-type=module -e "import * as m from './index.mjs'; console.log(Object.keys(m))"` → `[ 'Snowball', 'default' ]`, and the same call against `english.mjs` → `[ 'EnglishStemmer', 'default' ]`. The bindings exist; only the declarations are missing.

## Suspected Code Paths

- `index.d.ts:19` — `export default Snowball;` is the only export declaration; no `export { Snowball }` or `export declare function Snowball`. Runtime `index.mjs:4` does `export { Snowball }`.
- `build.js:81-83` — the per-language `.d.ts` template emits `export default function ${className}(): Stemmer;` as its only export declaration, while `build.js:78-80` emits a `.mjs` shim with both `export default` and `export { ${className} }`.
- `index.mjs:3-4` — `export default Snowball;` plus `export { Snowball };`, the runtime side of the root mismatch.
- `dist/languages/english.d.ts:12` (and the 15 sibling bundles) — generated output exhibiting the same omission.
- `README.md:88-95` — TypeScript section documents only default imports, so the defect is undocumented behaviour rather than a broken documented example.

## Root Cause Hypothesis

The `.mjs` shims and the `.d.ts` templates were authored independently and drifted. The
`.mjs` generator emits a default **and** a named export for convenience and tree-shaking
symmetry; the `.d.ts` generator emits only the default. Because the runtime export is a
superset of the declared one, no existing consumer breaks and no test caught it — the
missing binding is only observable by writing TypeScript that uses the named form.
Confidence: high (reproduced directly, and the divergence is visible by diffing the two
generators in `build.js`).

## Proposed Remediation

**Preferred**: Add the named export to both declaration surfaces, so declarations mirror
runtime exactly.

In `index.d.ts`, declare the named binding explicitly. Since `Snowball` is already declared
as a function, the smallest faithful form is to re-export it:

```ts
declare function Snowball(language: Language): Stemmer;

export default Snowball;
export { Snowball };
```

In `build.js`, extend the per-language `.d.ts` template to emit the named export alongside
the default:

```ts
declare function ${className}(): Stemmer;

export default ${className};
export { ${className} };
```

This is purely additive. It widens the accepted surface; it does not narrow or alter any
existing declaration, so no consumer can regress. The default import documented in the
README continues to work unchanged.

**Alternatives** (optional):
- *Drop the named runtime exports instead* (`index.mjs`, `build.js:78-80`) to match the
  current declarations. Rejected: it is a runtime API removal, whereas the proposed fix is
  additive, and the named bindings are plausibly used by existing consumers.
- *Re-export from the root rather than each language bundle* — have `index.d.ts` re-export
  each language module. Rejected: complicates the export map for no benefit over declaring
  each bundle's own named export.

**Files likely to change**:
- `index.d.ts`
- `build.js` (per-language `.d.ts` template, lines 81-83)
- `.specify/bugs/snowball-factory-constructor-mismatch/fix.md` (retract the false `Stemmer` claim)

**Tests to add or update**:
- A type-level test compiling the named-import forms for the root and at least one
  per-language entrypoint, asserting zero errors under `strict`.
- A negative control in the same suite, asserting a deliberately wrong member *does* error,
  so the type test cannot pass vacuously by degrading to `any`.
- Optionally a test asserting declared exports match runtime `Object.keys()` of the
  corresponding `.mjs`, which would catch this whole class of drift.

## Risks & Considerations

- **Additive only.** No runtime behaviour changes; no existing valid import breaks.
- **Surface widening.** Consumers who write `import { Snowball }` will now compile. This is
  the intent, but it does widen the public API surface slightly — worth a line in the
  release notes.
- **No `tsc` in this repo.** The project has no `tsconfig.json` and no `typescript`
  devDependency, so type-level assertions cannot live in the existing `vitest` suite
  without adding tooling. Options: add `typescript` as a devDependency and a `tsc --noEmit`
  script, or verify out-of-band against a packed tarball as was done here. Adding the
  devDependency is the more durable choice and also closes the gap that let this ship.
- **CJS consumers are unaffected** — `module.exports = X` interop already resolves the
  default; this is specific to the ESM/type surface.
- **The generated `.d.ts` files are build output.** The fix belongs in `build.js`;
  hand-editing `dist/languages/*.d.ts` would be silently overwritten on the next build.

## Open Questions

- [NEEDS CLARIFICATION: should this ship as `1.0.3`, or fold into a not-yet-published
  `1.0.2`? `1.0.2` is committed and tagged but **not yet on npm** — publish is blocked
  pending an OTP. Folding in is still possible and avoids shipping a known-incomplete
  types fix separately.]
- [NEEDS CLARIFICATION: should the README TypeScript section also document the named-import
  forms, or stay default-only?]
- [NEEDS CLARIFICATION: is adding `typescript` as a devDependency acceptable for this
  project, given `lint` currently only covers `stemmer/src/`?]