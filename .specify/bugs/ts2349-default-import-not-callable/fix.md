# Bug Fix: Split the declarations so ESM default imports and CJS `import = require` are callable

- **Slug**: ts2349-default-import-not-callable
- **Fixed**: 2026-10-07T19:10:00Z
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

The package shipped one ESM-syntax `.d.ts` per entry point, shared by both the `import` and
`require` export conditions. Because the package is CommonJS, TypeScript classified those files as
CommonJS and applied CJS↔ESM interop, so a default import (and `import = require`) resolved to the
module namespace instead of the callable factory — **TS2349** for the root entry point, every
per-language subpath, and both ESM and CJS. Each resolution mode now has its own declaration: an
ESM `.d.mts` (default + named) for `import`, and a CJS `export =` declaration for `require`. A new
ESM-mode typecheck config and a runtime export-parity test lock both halves of the contract in.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `index.d.ts` | modified | Rewritten as the CommonJS `export =` form (callable + merged namespace re-exporting `Stemmer`/`Language`); serves the `require` condition and legacy `node10` |
| `index.d.mts` | added | ESM declaration (`export default` + named `Snowball` + types); serves the `import` condition |
| `build.js` | modified | Per-language templates now emit a CJS `.d.ts` (`export =` + namespace) **and** an ESM `.d.mts` (default + named) |
| `package.json` | modified | Every `exports[*].import.types` → `.d.mts`; `index.d.mts` added to `files`; `typecheck` now runs both tsconfigs |
| `tsconfig.esm.json` | added | ESM-mode typecheck config including `types/esm/**/*.mts` |
| `types/esm/index.test-d.mts` | added | ESM root: default + named callable, with negative controls |
| `types/esm/per-language.test-d.mts` | added | ESM per-language default + named parity, with negative controls |
| `types/index.test-d.ts` | modified | Now a CJS-mode test (default import + `import = require`, package-name resolution); named-import assertions moved to the ESM suite |
| `types/per-language.test-d.ts` | modified | Same, for a generated per-language bundle |
| `test/api.test.js` | modified | New runtime export-parity suite: root ESM default/named + all 16 per-language ESM entries |

## Diff Highlights

`index.d.ts` — the CJS surface (was `export default Snowball; export { Snowball };`):

```ts
declare function Snowball(language: Snowball.Language): Snowball.Stemmer;

declare namespace Snowball {
  interface Stemmer { setCurrent(word: string): void; getCurrent(): string | null; stem(): boolean; }
  type Language = "danish" | /* … */ | "turkish";
}

export = Snowball;
```

`index.d.mts` — the new ESM surface (the shape that was previously, and wrongly, in `index.d.ts`):

```ts
export interface Stemmer { /* … */ }
export type Language = /* … */;
declare function Snowball(language: Language): Stemmer;
export default Snowball;
export { Snowball };
```

`build.js` — per language now emits both files:

```js
// import condition
fs.writeFileSync(path.join(languagesDir, `${langName}.d.mts`),
  `export ${stemmerInterface}\ndeclare function ${className}(): Stemmer;\nexport default ${className};\nexport { ${className} };\n`);

// require condition
fs.writeFileSync(path.join(languagesDir, `${langName}.d.ts`),
  `declare function ${className}(): ${className}.Stemmer;\n\ndeclare namespace ${className} {\n${indent(stemmerInterface, 1)}}\n\nexport = ${className};\n`);
```

`package.json` (one language shown; the root is analogous):

```diff
   "./english": {
     "import": {
-      "types": "./dist/languages/english.d.ts",
+      "types": "./dist/languages/english.d.mts",
       "default": "./dist/languages/english.mjs"
     },
     "require": {
       "types": "./dist/languages/english.d.ts",
       "default": "./dist/languages/english.js"
     }
   }
```

## Tests Added or Updated

- `types/esm/index.test-d.mts` — pins that the root **ESM default import** and named import both
  produce a `Stemmer`, with `@ts-expect-error` controls. This is the test that failed with TS2349
  before the fix; it runs under `tsconfig.esm.json` because CJS resolution cannot observe the defect.
- `types/esm/per-language.test-d.mts` — same for a generated per-language bundle.
- `types/index.test-d.ts` — retargeted to the CJS surface: default import and `import = require`
  are callable, `Stemmer`/`Language` remain reachable, negative controls intact.
- `types/per-language.test-d.ts` — same for a per-language bundle.
- `test/api.test.js::entrypoint export parity (runtime)` — root `index.mjs` exposes a callable
  default with `Snowball === default`; each of the 16 per-language `.mjs` entries exposes a callable
  default and a matching named export that is the same reference (17 new tests).

## Local Verification

- `rm -rf dist && npm test` → **435 passed** (405 stemming + 30 api), 0 failed; the suite rebuilds
  `dist/` from source first, so this is a from-scratch check.
- `npm run typecheck` → exit 0, running **both** `tsconfig.json` (CJS surface) and
  `tsconfig.esm.json` (ESM surface).
- `npm run lint` → clean.
- `node build.js` → regenerates the root plus 16 bundles; `dist/languages/english.d.ts` is now the
  CJS `export =` form and `dist/languages/english.d.mts` the ESM default + named form.
- Manual: the CJS test files import the package **by name**, so they exercise the exports map's
  `require` condition; the ESM test files do the same for the `import` condition (via Node/TS package
  self-reference). Both branches of the map are therefore under test.
- `npm pack --dry-run` → `index.d.mts` (1.1 kB), `index.d.ts` (1.3 kB) and all `dist/languages/*.d.mts`
  are included; 72 files total.
- Regression sensitivity (each applied, observed, then reverted; `npm run typecheck` green after):
  - **Faithful pre-fix revert** (`git show HEAD:index.d.ts` + the old exports map) → reproduced the
    original defect: `error TS2349: This expression is not callable` on the root ESM default import
    (and TS2595 on the per-language named import). The new ESM suite catches it.
  - `require.types` pointed at the `.d.mts` (the naive single-file alternative) → TS2349 in the CJS
    suite, confirming the CJS tests are load-bearing.
  - `import.types` pointed at the CJS file → TS2595 in the ESM suite.

## Deviations from Assessment

- **Kept `index.d.ts` as the CJS declaration instead of adding a `.d.cts`.** The package has no
  `"type": "module"`, so a `.d.ts` is already a CommonJS declaration; this avoids a redundant file and
  keeps the top-level `types` field valid for legacy `node10` consumers. Functionally equivalent to
  the `.d.cts` prototype in the assessment (which was verified in `repro/`).
- **Resolved the "named binding for CJS?" open question in favour of ESM-only.** The CJS runtime is
  `module.exports = Snowball` with no named properties, so declaring a named export for the `require`
  condition would reintroduce a false declaration. The named-import assertions therefore moved from
  the CJS-mode tests to the new ESM-mode tests; the previous 1.0.2 test asserted named imports in a
  CJS-mode file, which could not reflect the real ESM shape.
- **Added `tsconfig.esm.json` rather than a `types/esm/package.json` marker.** `*.mts` files are ES
  modules by extension, and importing by package name exercises the exports map through self-reference,
  so a marker file was unnecessary.
- **Did not commit a generic declaration/runtime parity *parser*.** The assessment listed that as a
  test to add; a runtime export-parity vitest suite was added instead (it guards the runtime half),
  while the declaration half is covered by the type tests. The generic parser remains a follow-up.
- **README left unchanged** (an open question in the assessment). The documented default-import forms
  now typecheck; no documentation fix was required.
- Open questions on on-disk naming and tag strategy were resolved as described; the tag is still a
  follow-up (nothing was published).

## Follow-ups

- **Move/recreate the `v1.0.2` tag.** It still points at `cef156b` (the named-export fix only). Since
  1.0.2 is unpublished, re-point the tag at the combined commit so it matches the published artifact,
  then ship both fixes together as 1.0.2 per the maintainer's instruction.
- **Release notes must be scoped.** They may state that the named exports are now declared; they must
  not claim ESM TypeScript consumption works unless this fix is in the same version (it is).
- Consider the generic parity test: compare `Object.keys()` of each `.mjs` against the value exports
  declared in the matching `.d.ts`/`.d.mts`, so this class of drift is caught beyond the pinned forms.
- `npm run lint` still covers only `stemmer/src/`; `build.js`, `types/`, and the tsconfigs remain
  unlinted (pre-existing gap).
- Publishing still requires an OTP for the `mlengse` account; `prepublishOnly` now runs
  build + test + typecheck (both configs), so the gate validates the type surface on publish.
