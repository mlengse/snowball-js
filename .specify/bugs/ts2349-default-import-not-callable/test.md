# Bug Verification: ESM default import and CJS `import = require` are callable

- **Slug**: ts2349-default-import-not-callable
- **Tested**: 2026-10-07T19:12:00Z
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The reported symptom no longer reproduces. Against a freshly `npm pack`ed `@mlengse/snowball-js@1.0.2`
(the artifact that would publish), the full import/require matrix — ESM default and named imports,
and CJS default and `import = require` — typechecks clean for both the root entrypoint and a
per-language entrypoint (previously 4 × TS2349), the runtime behaves identically, and
declaration/runtime parity holds across all 17 entrypoints. No regressions were found.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | `npm pack` → extract into `verify/consumer`, `tsc -p verify/consumer/tsconfig.json` | pass | 0 errors on the 8-cell matrix; pre-fix this was 4 × TS2349 |
| New / updated tests | `node_modules/.bin/vitest run` | pass | 435 passed (418 prior + 17 new parity tests) |
| ESM-mode type suite (new) | `npm run typecheck` (`tsconfig.json` + `tsconfig.esm.json`) | pass | 0 errors in both resolution modes |
| Regression suite | `npm test` (rebuilds `dist/` from source first) | pass | 435 passed (2 files), clean-tree rebuild |
| Lint | `npm run lint` | pass | clean (`eslint stemmer/src/`) |
| Declaration/runtime parity | `node parity.js` in `verify/consumer` | pass | `DECLARATION/RUNTIME PARITY OK - all 17 entrypoints` |
| Runtime matrix | `node parity.js` | pass | `esm-default=run esm-named=run cjs-root=run cjs-lang=run` |
| Negative controls | `verify/consumer/types-and-controls.mts` `@ts-expect-error` directives | pass | directives were consumed → declarations do not degrade to `any` |
| Types reachable from both conditions | `import type { Stemmer, Language }` root + per-language, under ESM and CJS | pass | compiled in the consumer matrix |
| Package contents | `npm pack` (inspect tarball) | pass | `index.d.mts`, `index.d.ts` and all `dist/languages/*.d.mts` shipped; 72 files |
| Regression sensitivity (pre-fix) | pre-fix revert reproduced in `fix.md`; new ESM suite flagged it | pass | `TS2349` on the root ESM default import before the fix |

## Output Excerpts

Consumer typecheck against the packed artifact (the exact reproduction from the assessment, now
passing on every mode):

```
=== tsc against packed 1.0.2 consumer (expect 0 errors) ===
CONSUMER TYPECHECK OK
```

Parity + runtime:

```
OK   root        named=Snowball
OK   english     named=EnglishStemmer
... (all 17 entrypoints)
DECLARATION/RUNTIME PARITY OK - all 17 entrypoints
runtime: esm-default=run esm-named=run cjs-root=run cjs-lang=run
```

Test suite:

```
 ✓ test/stemming.test.js (405 tests)
 ✓ test/api.test.js (30 tests)
 Test Files  2 passed (2)
      Tests  435 passed (435)
```

## Residual Risks

- **Single platform / single toolchain.** All checks ran on Windows with Node v24.16.0 and
  `tsc 5.9.3`. No older-Node or older-TypeScript matrix.
- **Bundler resolution not exercised.** `moduleResolution: bundler` consumers take the `import`
  condition and should now read `.d.mts`; expected correct but untested here.
- **Legacy `node10` resolution not exercised.** It reads the top-level `types` (`./index.d.ts`, the
  CJS `export =` form); expected correct but untested.
- **Parity check is shallow.** `parity.js` compares the single named export per entrypoint via
  regex, not a full declared-vs-runtime export comparison, so a future *additional* export on only
  one side would not be caught generically (a deeper parity test remains a follow-up).
- **Type outcomes verified by `tsc` only** — no editor/LSP or third-party type-checker cross-check.
- **No CI.** These are local checks; nothing enforces them on push.
- **Release mechanics outstanding.** `v1.0.2` still points at the pre-fix commit `cef156b`, and
  1.0.2 is unpublished; the tag must move and the release notes scoped (see `fix.md` Follow-ups).

## Recommendation

Close the bug — verified end-to-end against the packed artifact, with the original TS2349
reproduction now passing in every resolution mode and no regressions. Before publishing, move the
`v1.0.2` tag to the combined commit and keep the release notes scoped to "named exports are now
declared" rather than any claim about ESM TypeScript having been fine before.
