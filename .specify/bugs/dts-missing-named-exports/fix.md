# Bug Fix: TypeScript declarations now declare the named exports that exist at runtime

- **Slug**: dts-missing-named-exports
- **Fixed**: 2026-10-07T18:36:00Z
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

`index.mjs` and every `dist/languages/*.mjs` export a named binding alongside the default
(`['Snowball', 'default']`, `['EnglishStemmer', 'default']`), but the declaration files
declared only the default. TypeScript therefore rejected named-import forms that are valid
JavaScript and work correctly at runtime (`TS2614`). Both declaration surfaces now declare
the named export, and `typescript` was added as a devDependency with an `npm run typecheck`
script so this drift cannot recur silently.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `index.d.ts` | modified | Added `export { Snowball };` beside the existing `export default Snowball;` |
| `build.js` | modified | Per-language `.d.ts` template now emits `export { ${className} };` after the default, matching the `.mjs` shim emitted two lines above it |
| `package.json` | modified | Added `typescript@^5.9.3` devDependency and a `typecheck` script; wired `typecheck` into `prepublishOnly` so declarations are validated before every publish |
| `tsconfig.json` | added | `strict`, `noEmit`, `nodenext`, `skipLibCheck: false`, `types: []`; includes `types/**/*.ts`, `index.d.ts`, and `dist/languages/*.d.ts` |
| `types/index.test-d.ts` | added | Root named/default import parity plus `@ts-expect-error` negative control |
| `types/per-language.test-d.ts` | added | Per-language named/default import parity plus negative control |
| `.specify/bugs/snowball-factory-constructor-mismatch/fix.md` | modified | Retracted the false `Stemmer` interface claim (see Deviations) |

## Diff Highlights

`index.d.ts`:

```diff
 declare function Snowball(language: Language): Stemmer;
 
 export default Snowball;
+export { Snowball };
```

`build.js` (per-language `.d.ts` template):

```diff
-export default function ${className}(): Stemmer;\n`
+export default function ${className}(): Stemmer;\nexport { ${className} };\n`
```

Note this brings the `.d.ts` template into line with the `.mjs` template directly above it,
which already emitted `export default ${className};\nexport { ${className} };\n`.

## Tests Added or Updated

- `types/index.test-d.ts` — pins that the root entrypoint exposes `Snowball` as both default and named export, that both produce a `Stemmer`, and that `Language` remains exported as a type.
- `types/per-language.test-d.ts` — pins the same for a generated per-language bundle (`EnglishStemmer`), including that the `Stemmer` interface is importable from the bundle (the claim the retracted follow-up got wrong, now locked in as a passing assertion).
- Negative control in both files via `@ts-expect-error` on a bogus member, a wrong-typed `getCurrent()` result, and an invalid `Language` value. These make the suite fail if declarations ever degrade to `any`, so the positive assertions cannot pass vacuously.

## Local Verification

- `node build.js` → 16 bundles regenerated; `dist/languages/english.d.ts` now ends with
  `export default function EnglishStemmer(): Stemmer;` / `export { EnglishStemmer };`
- `npm run typecheck` → **exit 0**
- `npm test` → **418 passed** (2 files), 0 failed
- `npm run lint` → exit 0
- `npm pack` + installed the resulting 1.0.2 tarball into a clean scratch project with
  `typescript@5.9.3`:
  - `import Snowball, { Snowball as NamedSnowball } from "@mlengse/snowball-js"` → compiles (was `TS2614`)
  - `import EnglishDefault, { EnglishStemmer as EN } from "@mlengse/snowball-js/english"` → compiles (was `TS2614`)
  - `import type { Stemmer, Language } from "@mlengse/snowball-js"` → compiles
  - Runtime check of all four forms: `root default: run | root named: run | lang default: run | lang named: run`
- Regression sensitivity (each revert was applied, observed, then restored):
  - Removing `export { Snowball };` from `index.d.ts` → `error TS2614: Module '"../index.js"' has no exported member 'Snowball'` — the suite catches the root regression.
  - Reverting the `build.js` template and rebuilding → `error TS2614: Module '"../dist/languages/english.js"' has no exported member 'EnglishStemmer'` — the suite catches the generated-bundle regression.
  - Degrading `Stemmer.setCurrent`/`getCurrent` to `any` → `error TS2578: Unused '@ts-expect-error' directive` — confirms the negative control is load-bearing and the suite cannot pass by types silently becoming `any`.
- `git status` after cleanup: only intended files modified; the packed `.tgz` was removed
  (it is not gitignored and must not be committed).

## Deviations from Assessment

- **Assessment named `index.d.ts` and `build.js` as the only source changes. Added `tsconfig.json`, `types/*.ts`, and `typescript` as a devDependency.** This was the user's explicit instruction ("add d typescript as a devDependency") and addresses the risk the assessment itself flagged: with no `tsc` in the repo, declaration/runtime drift is undetectable. The type tests could not live in the existing `vitest` suite without this tooling.
- **Negative control implemented as inline `@ts-expect-error` rather than a separate file asserting errors.** The assessment suggested "a negative control asserting a deliberately wrong member *does* error". A separate failing-compile file cannot live in the same `tsc` run as the passing suite, so it would need a second config and a bespoke assertion. Inline `@ts-expect-error` achieves the same guarantee inside one compilation — an unused directive is itself `TS2578`, so a vacuous pass is impossible. Verified empirically by degrading the declarations to `any`.
- **Added `typecheck` to `prepublishOnly`.** Not in the assessment. Rationale: the whole point of adding `tsc` is to catch this class of defect before it ships, and `prepublishOnly` already runs `build` and `test`. This means the pending 1.0.2 publish will now validate declarations automatically.
- **Scope expanded beyond the two source files** to include `snowball-factory-constructor-mismatch/fix.md`. The assessment listed this retraction explicitly under "Files likely to change"; doing it in the same change avoids leaving a known-false claim in the audit trail.

## Follow-ups

- `npm publish --access public` is still blocked on an OTP for the `mlengse` account. `1.0.2` is tagged and pushed but not on npm, so nothing has shipped yet and no consumer is stranded.
- Because `v1.0.2` was already tagged and pushed before this fix landed, the tag now points at a commit without the types fix. Either amend the tag before publishing (cleanest, since the version is unpublished) or publish `1.0.2` and cut `1.0.3` for the types fix. Recommend amending, since no one has installed `1.0.2` yet.
- README's TypeScript section still documents only default imports. Could mention the named form now that it is declared.
- `lint` still covers only `stemmer/src/`, so `build.js` and `types/` remain outside lint scope. Widening the eslint config to include them (with the right globals) would close that gap.
- Consider a runtime-vs-declaration parity test that compares `Object.keys()` of each `.mjs` against the exports declared in the matching `.d.ts`. That would catch this entire class of drift generically, rather than per-binding.