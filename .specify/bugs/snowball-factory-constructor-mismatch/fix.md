# Bug Fix: Per-language entrypoints returned undefined when called as documented

- **Slug**: snowball-factory-constructor-mismatch
- **Fixed**: 2026-10-07T18:11:00Z
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

The per-language bundles (`@mlengse/snowball-js/english` etc.) exported the raw stemmer
function, which is a **constructor** (assigns to `this`, returns `undefined`), while both
the generated `.d.ts` and the README declare/document it as a **factory**. Calling
`EnglishStemmer()` therefore returned `undefined` and the documented usage threw
`TypeError: Cannot read properties of undefined (reading 'setCurrent')`. The generated
bundles now work as a factory when called plainly, and still work with `new`.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `build.js` | modified | Per-language bundle template now self-delegates to `new` when not called as a constructor |
| `test/api.test.js` | added tests | `per-language entrypoints` suite: factory call + `new` for all 16 languages, plus an end-to-end factory stem |

## Diff Highlights

```diff
 module.exports = ${className};
 ${indent(among, 0)}
 ${indent(snowballProgram, 0)}
 function ${className}() {
+	if (!(this instanceof ${className}))
+		return new ${className}();
 ${indent(body, 1)}
 }
 ```

## Tests Added or Updated

- `test/api.test.js::Snowball API > per-language entrypoints > are callable as factories, matching their .d.ts and README` — pins that the documented factory form yields a stemmer for all 16 languages.
- `test/api.test.js::Snowball API > per-language entrypoints > are also usable with new` — guards against fixing the factory form by breaking the constructor form.
- `test/api.test.js::Snowball API > per-language entrypoints > produce a working stemmer via the factory call` — end-to-end `setCurrent`/`stem`/`getCurrent` through the factory path; this is the exact case that threw before.

## Local Verification

- Commands run:
  - `node build.js` → build complete, 16 per-language bundles
  - `npm test` → **418 passed (2 files)**, 0 failed. `pretest` reruns the build, so tests ran against freshly generated bundles.
  - `npm run lint` → clean (eslint `stemmer/src/`, no findings)
  - `npm install` → installed 122 packages; dev dependencies were absent in the working tree, so the suite could not run before this.
- Manual checks:
  - Reproduction before fix: `require('./dist/languages/english.js')()` returned `undefined`; `new` returned a working stemmer. Confirmed for both `.js` (CJS) and `.mjs` (ESM) entrypoints.
  - Reproduction after fix: all 16 languages return a working stemmer via **both** `LanguageStemmer()` and `new LanguageStemmer()`.
  - Regression check: temporarily removing the two-line guard makes the two new factory tests fail with the original consumer-facing errors (`expected false to be true`, `Cannot read properties of undefined (reading 'setCurrent')`), confirming the tests actually pin the bug. Guard restored; full suite green again.
  - Root entrypoint unaffected: `Snowball('english')` and `new Snowball('english')` both worked before and after.

## Deviations from Assessment

The assessment's root-cause hypothesis was directionally right about a factory/constructor
mismatch but wrong in scope. Recorded here rather than editing `assessment.md`:

- **The mismatch is not in the root entrypoint.** The assessment suspected `index.d.ts` vs
  `dist/Snowball.js`. The root `Snowball(lng)` genuinely is a factory
  (`return new stemFactory[stemName]()`) and was already correct, as was `index.d.ts`.
  No change was needed there.
- **The real defect is in the per-language bundles only.** `build.js` emits
  `module.exports = EnglishStemmer;` where `EnglishStemmer` is the raw upstream stemmer
  constructor. The generated `dist/languages/*.d.ts` declares
  `export default function EnglishStemmer(): Stemmer;` and `README.md` documents
  `const stemmer = EnglishStemmer();` — both promise a factory. This is a hard runtime
  failure, not a typing nuance, so the verdict was upgraded from *likely valid, needs
  reproduction* to reproduced-and-confirmed.
- **Fixed the runtime, not the types.** The assessment offered "change runtime to export a
  class/constructor" as an alternative. That was rejected: the `.d.ts` and README are the
  documented public contract, and the constructor form already worked. Making the bundle
  dual-callable honours both with no breaking change to any existing consumer.
- **`index.d.ts` left untouched** — it already matched runtime behaviour.
- Scope was narrower than the assessment's file list: only `build.js` and the test file
  needed changes; no per-language `.d.ts` edits were required.

### Related issue noted but NOT fixed (out of scope)

The per-language `.d.ts` files declare only `export default function XStemmer(): Stemmer`
and do **not** export the `Stemmer` interface, but `README.md` documents
`import EnglishStemmer, { Stemmer } from '@mlengse/snowball-js/english';`. That named
type import does not typecheck. It is a separate documentation/types defect and was left
alone to keep this fix minimal. Worth its own assessment.

## Follow-ups

- Consider exporting the `Stemmer` interface from the per-language `.d.ts` templates in `build.js` so the README's TypeScript example compiles.
- Add a smoke test that runs `tsc --noEmit` against the shipped `.d.ts` files, to catch declaration/runtime drift like this automatically.
- The published `1.0.1` remains broken for per-language imports; this needs a patch release (`1.0.2`) to reach consumers.