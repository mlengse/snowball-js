# Bug Verification: Per-language entrypoints returned undefined when called as documented

- **Slug**: snowball-factory-constructor-mismatch
- **Tested**: 2026-10-07T18:14:00Z
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The reported symptom no longer reproduces: the documented factory call on all 16
per-language entrypoints now returns a working stemmer instead of `undefined`. The fix is
load-bearing (an out-of-workspace negative control reproduces the original `undefined`
without it), the `new` constructor form that already worked still works, and the full suite
passes from a clean rebuild. No regressions found.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | `node -e` exercising the exact README usage (`LanguageStemmer()` → `setCurrent`/`stem`/`getCurrent`) across all 16 languages | pass | All 16 factory calls return working stemmers; previously all returned `undefined` |
| Reproduction (ESM path) | `node --input-type=module` importing `dist/languages/english.mjs` and calling the factory | pass | Returns working stemmer, stems `running` → `run` |
| Backward compatibility | `node -e` calling `new LanguageStemmer()` for all 16 languages | pass | Constructor form still returns working stemmers — the fix did not break what already worked |
| Root entrypoint unchanged | `Snowball('english')` and `new Snowball('english')` | pass | Both return working stemmers; root was never defective |
| New / updated tests | `npx vitest run test/api.test.js` | pass | 13 passed, 0 failed |
| Regression suite | `npx vitest run` | pass | 418 passed (2 files), 0 failed |
| Regression suite (clean rebuild) | `rm -rf dist && npm test` | pass | `pretest` regenerates `dist/`; 418 passed. Confirms the fix is reproducible from source, not from stale artifacts |
| Lint (project scope) | `npm run lint` | pass | Exit code 0, no findings. Note: this script only covers `stemmer/src/` |
| Lint (changed files) | `npx eslint build.js test/api.test.js` | fail (pre-existing, not a regression) | 40 `no-undef` errors. Baseline check via `git show HEAD:test/api.test.js \| npx eslint --stdin` yields **30 of the same errors** on the unmodified file — pre-existing config-scope gap (eslint config declares no `describe`/`it`/`expect`/`__dirname` globals and `npm run lint` excludes these paths) |
| Type-check | `npx tsc --noEmit` | not-run | No TypeScript toolchain in the project: no `tsconfig.json`, no `typescript` devDependency. Declared as a follow-up in fix.md |
| Guard present in build output | regex scan of all 16 `dist/languages/*.js` | pass | Guard present in 16/16 generated bundles |
| Negative control | copy of generated bundle with the guard stripped, loaded from an out-of-workspace temp dir | pass | Pre-fix factory call → `undefined` (original bug); post-fix → working stemmer; `new` works in both. Proves the guard is load-bearing and the tests pin real behaviour |
| Reaches consumers | `npm pack --dry-run` | pass | 55 files, includes all 16 `dist/languages/*.js` (with the guard), `dist/Snowball.js`, `index.d.ts`. Fix ships on next publish |

## Output Excerpts

Reproduction, post-fix:

```
REPRODUCTION-NOW-GONE: all 16 per-language factory calls return working stemmers
ESM factory path: run
BACKWARD-COMPAT OK: all 16 still work with new
root factory: run | root new: run
```

Negative control:

```
pre-fix  factory call  -> undefined  (original bug)
post-fix factory call  -> working stemmer
post-fix new           -> working stemmer
pre-fix  new           -> working stemmer
```

Regression suite:

```
 Test Files  2 passed (2)
      Tests  418 passed (418)
```

Pre-existing lint baseline (unmodified `HEAD` version of `test/api.test.js`):

```
test/api.test.js
   3:1  error  'describe' is not defined  no-undef
  ...
✖ 30 problems (30 errors, 0 warnings)
```

## Residual Risks

- **Type-level conformance unverified.** The fix corrects runtime behaviour to match the existing `.d.ts`. That the declarations now typecheck against reality was not machine-verified — the project has no `tsc`. Residual risk is low (the `export default function XStemmer(): Stemmer` signature already matched the corrected factory semantics) but it is asserted, not proven.
- **Lint on the changed files was not made clean.** `build.js` and `test/api.test.js` carry 40 `no-undef` errors under the project's eslint config, of which 30 pre-exist on the untouched baseline. My change added 8 more of the same pre-existing class (new `describe`/`it`/`expect` lines). Not a regression, but the changed files are still outside the configured lint scope, so nothing lints them in CI.
- **Published `1.0.1` remains broken.** Verification ran against the working tree only. Consumers on the already-published `1.0.1` still hit this bug until a patch release ships.
- **Node-version coverage.** Checks ran on the single local version (Node v24.16.0, Windows). No older-Node matrix was exercised.
- **Stale `test.md` risk avoided** by reading `fix.md` first; no pre-existing report to overwrite.

## Recommendation

Close the bug — verified end-to-end. The original symptom was independently reproduced
in the negative control, is now gone across every affected language and both module
systems, the previously-working constructor form is preserved, and the full suite passes
from a clean rebuild. Ship as a patch release (`1.0.2`): the tarball contents were
confirmed to carry the fix. Before or alongside release, add the `tsc --noEmit` smoke
test over the shipped `.d.ts` files proposed in `fix.md`, and widen the eslint config to
cover `build.js` and `test/` so those files are not silently unlinted.