# Bug Assessment: ESM default import and CJS `import = require` are typed as non-callable (TS2349)

- **Slug**: ts2349-default-import-not-callable
- **Created**: 2026-10-07T19:05:00Z
- **Source**: pasted text — the "New Finding" recorded in `.specify/bugs/dts-missing-named-exports/test.md`, plus the maintainer's directive not to publish until it is fixed
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

From the verification of the previous bug (`dts-missing-named-exports/test.md`):

> - `esm-default` fails with **TS2349 "This expression is not callable"** for root *and* every
>   per-language entrypoint.
> - `cjs-require` (`import X = require(...)`) fails with the same TS2349.
> - Both fail identically in **1.0.1 and 1.0.2** — i.e. this predates the fix and survives it.
>
> Practical meaning: a TypeScript consumer using ESM — the primary consumption path for this
> package — cannot use it at all. `import Snowball from "@mlengse/snowball-js"` types as a
> module namespace, not a callable factory. Only `cjs-default` works today.

Maintainer directive accompanying this assessment (treated as a constraint, not evidence):

> don't publish 1.0.2 yet. It fixes the named-export gap but leaves ESM TypeScript consumers
> still broken, and the release notes must not imply otherwise. Assess the TS2349 defect next,
> then ship both together as 1.0.2.

No URL was supplied, so the URL Trust Policy did not apply (`Source: pasted text`).

## Symptom

Under `module`/`moduleResolution: nodenext`, TypeScript rejects the package's **default** import
and the CJS `import = require` form because it types the imported binding as the module namespace
object rather than the callable factory function:

```
error TS2349: This expression is not callable.
  Type 'typeof import(".../@mlengse/snowball-js/index")' has no call signatures.
```

This affects the root entrypoint and all 16 per-language subpaths, for both `import X from` (ESM)
and `import X = require(...)` (CJS). It is worse than it sounds: the default import is not only the
primary consumption path, it is the form the README itself documents under "ES Modules"
(`README.md:24-33`). Named imports (`import { Snowball }`) work — that path was fixed by 1.0.2.
The runtime is entirely unaffected: all forms execute correctly and return the correct stem.

## Reproduction

Independent reproduction, offline, no package manager or network (harness committed under
`repro/`; see `repro/README.md`):

1. Copy the published surface (`dist/`, `index.mjs`, `index.d.ts`, `package.json`) into a scratch
   `repro/node_modules/@mlengse/snowball-js/`.
2. Add `repro/package.json` with a *different* `name` so the import does not resolve by package
   self-reference and actually exercises the copied package.
3. Add a `nodenext` tsconfig and ESM/CJS consumers that call the default import, a per-language
   default import, the named import, and `import = require` (see step 5 for the exact result).
4. Run the repo's own compiler: `node_modules/.bin/tsc -p .specify/bugs/ts2349-default-import-not-callable/repro/tsconfig.json`.
5. Observed — **4 × TS2349**, on exactly the default/require forms, while the named control compiles:

   ```
   esm-default-root.mts:4  error TS2349 ... Type 'typeof import(".../index")' has no call signatures.
   esm-default-lang.mts:4  error TS2349 ... Type 'typeof import(".../dist/languages/english")' has no call signatures.
   cjs-require-root.cts:4  error TS2349 ... Type 'typeof import(".../index")' has no call signatures.
   cjs-types-root.cts:4    error TS2349 ... Type 'typeof import(".../index")' has no call signatures.
   ```

   The named-import control (`esm-named-root.mts`) compiled **and** consumed its `@ts-expect-error`
   directive, proving the declarations are genuinely loaded (not degraded to `any`) and the failing
   cells are meaningful.

6. Runtime control (same copied package): ESM default, per-language default, and CJS `require` all
   succeed —

   ```
   ESM default root -> run
   CJS require root -> run
   ```

   So the function is callable at runtime; only the declarations are wrong.

7. Prototype of the proposed fix (dual `.d.mts`/`.d.cts`, export conditions repointed) → **0 errors**
   across the whole matrix. Naive variant (both conditions pointed at the single `.d.mts`) → ESM
   cells pass but the 2 CJS cells still fail. Both result sets are reproduced by
   `repro/apply-prototype.js` and `repro/apply-naive.js`.

## Suspected Code Paths

- `package.json:16-26` — the root `exports["."]` object points **both** `import.types` and
  `require.types` at the single `./index.d.ts`.
- `package.json:27-186` — all 16 per-language subpaths repeat the same pattern (one `.d.ts` shared
  by both conditions).
- `index.d.ts:28-31` — `declare function Snowball(...)` + `export default Snowball;` +
  `export { Snowball };` uses **ESM export syntax**, but the package is CommonJS (no
  `"type": "module"`), so TypeScript classifies this file as a CommonJS declaration.
- `build.js:83-85` — the per-language `.d.ts` template emits the same ESM-style default/named form,
  while `build.js:69` writes `module.exports = ${className}` for the CJS runtime beside it.
- `index.mjs:1-4` — the real ESM entry exports a genuine default (the function), so the runtime
  default *is* callable; only its declaration is wrong.
- `dist/Snowball.js:38` (`module.exports = Snowball;`) and `dist/languages/*.js` — the CJS runtime
  the `require` condition actually loads.
- `tsconfig.json:1-12` + `types/index.test-d.ts`, `types/per-language.test-d.ts` — the repo's type
  tests run only in CJS resolution mode (no `"type": "module"` anywhere), so they cannot observe this
  ESM-only failure. This is the coverage gap that let the defect ship.
- `README.md:24-33` — the documented "ES Modules" example is precisely the failing default import.

## Root Cause Hypothesis

There is one declaration file per entry point, written with ESM export syntax, shared by both the
`import` and `require` resolution conditions. Because the package has no `"type": "module"`,
TypeScript under `nodenext` classifies those `.d.ts` files as **CommonJS** and applies CJS↔ESM
interop. For a CJS-format module imported from ESM, `import X from "pkg"` binds `X` to the module's
export object (the namespace), not to `exports.default`; the namespace has no call signature, hence
TS2349. Sharing the same file for `require` means `import X = require("pkg")` also receives the
namespace, producing the identical error. Named imports bind to a *property* of that object, which
is why `import { Snowball }` works and why the 1.0.2 fix improved only `esm-named`. The runtime is
unaffected because the `import` condition loads `index.mjs` (a real ESM default export) and the
`require` condition loads `dist/Snowball.js` (`module.exports = Snowball`) — the declarations simply
fail to describe either shape. Confidence: **high** (independently reproduced; the failure mode,
the affected cells, and the runtime behaviour all match the hypothesis exactly).

## Proposed Remediation

**Preferred**: give each resolution mode its own declaration file, so the declarations mirror the
already-split runtime (`import` → `.mjs`/ESM, `require` → `.js`/CJS):

1. **ESM declaration** per entry point (e.g. `index.d.mts`, `dist/languages/<lang>.d.mts`) carrying
   the current content: `export default` **and** the named export, plus the `Stemmer`/`Language`
   types. Wire it to `exports[...].import.types`.
2. **CJS declaration** per entry point (e.g. `index.d.cts`, or keep `index.d.ts` as the CJS form):
   an `export =` callable with a merged namespace re-exporting the types —

   ```ts
   declare function Snowball(language: Snowball.Language): Snowball.Stemmer;
   declare namespace Snowball {
     interface Stemmer { setCurrent(word: string): void; getCurrent(): string | null; stem(): boolean; }
     type Language = /* … */;
   }
   export = Snowball;
   ```

   Wire it to `exports[...].require.types`.
3. Point the top-level `types` field at the CJS form so legacy `node10` consumers stay correct.
4. Generate the per-language pair from the templates in `build.js` (currently a single `.d.ts`
   template at `build.js:83-85`), and add any new root declaration file to `package.json` `files`
   (`dist/` already covers the generated per-language pair; a new root `index.d.mts` must be listed).

Both conditions need their **own** file: pointing both at the `.d.mts` fixes ESM but breaks CJS
(verified: 2 × TS2349), and `export =` alone would break the ESM default import.

**Alternatives**:
- *Share one `.d.mts` for both conditions* — verified to leave the 2 CJS cells broken. Rejected.
- *`"type": "module"` + ESM-only declarations* — breaking for the existing CJS `require` consumers
  the package deliberately supports. Rejected.
- *Keep one `.d.ts` and document "use the named import instead"* — does not fix the README's
  documented default import and leaves `import = require` broken. Rejected.
- *.d.cts vs a CJS-format `.d.ts*` on the require side — equivalent; `.d.ts` keeps the legacy
  `types` field simplest (the package is already CJS by default). Minor implementation choice.

**Files likely to change**:
- `package.json` (export-map `types` conditions for root + 16 languages; `files`; possibly `types`)
- `index.d.ts` (→ CJS `export =` form) and a new `index.d.mts`
- `build.js` (per-language declaration templates)
- `types/*.test-d.ts` plus a new ESM-mode test config (`tsconfig.esm.json` / `types/esm/`)
- tag/version handling for the combined 1.0.2 (see Risks)

**Tests to add or update**:
- An **ESM-mode** type test — the repo has none — asserting the default import is callable for the
  root and a per-language entrypoint, that `import = require` is callable, that the named imports
  still work, and with `@ts-expect-error` negative controls. It must run where the *consumer* is ESM
  (e.g. `types/esm/` with a `{"type":"module"}` marker, or `.mts` files + a second tsconfig), or it
  cannot observe this defect.
- Extend the existing CJS-mode tests to pin the new CJS `export =` shape.
- A runtime smoke test that the default callable resolves for every entrypoint (declaration/runtime
  drift guard).
- Commit the export-parity script prototyped in the prior verification so this class of drift is
  caught generically rather than per-binding.

## Risks & Considerations

- **Two declarations per entry point must stay in sync.** Add a parity check (the committed script
  above) so the ESM and CJS declaration files cannot drift from each other or from the runtime.
- **CJS named import.** Converting the CJS declaration to `export =` may drop `import { Snowball }`
  for CJS consumers. That named form is new in 1.0.2 and unpublished, so the exposure is
  negligible, but the fix must decide whether the named binding is offered to CJS too (via a
  namespace member) or reserved for ESM.
- **Legacy `node10` resolution** reads only `types`; keep it pointing at a CJS-compatible
  declaration so older toolchains do not newly break.
- **`exports` condition ordering** — `types` must remain first inside each condition block.
- **Bundler resolution** (`moduleResolution: bundler`) takes the `import` condition, so it will now
  read the `.d.mts`; verify the `default`/named shape is correct there too.
- **Tag/version.** `v1.0.2` already points at `cef156b` (the named-export fix only) and is pushed to
  `origin`. Since the version is unpublished, move/recreate the tag after both fixes land so the tag
  matches the published artifact — the maintainer's "ship both together as 1.0.2" requires this.
- **Publish gating is now automatic.** `prepublishOnly` runs build + test + typecheck, so once the
  ESM-mode type test lands, `npm publish` will fail until the defect is fixed. This is intended, and
  is precisely why 1.0.2 must not be published before this fix.
- **Release notes must be scoped to what actually ships.** They may say the named exports are now
  declared; they must **not** claim ESM TypeScript consumption works unless the TS2349 fix is
  included in the same version.
- **No platform/version matrix.** All checks were on Windows with Node v24.16.0 and `tsc` 5.9.3.

## Open Questions

- [NEEDS CLARIFICATION: should the CJS declaration also expose the named binding
  (`Snowball`/`EnglishStemmer`) for `import { X }` under CJS, or is the named form ESM-only?]
- [NEEDS CLARIFICATION: on-disk naming — root `index.d.mts` + `index.d.cts`, or `index.d.mts` while
  keeping `index.d.ts` as the CJS form?]
- [NEEDS CLARIFICATION: should the README TypeScript section be expanded to document both the
  default and named forms now that both will be typed for ESM, or stay default-only?]
- [NEEDS CLARIFICATION: tag strategy — delete and re-create `v1.0.2` after both fixes land, or leave
  the existing tag in place and rely on the publish?]
