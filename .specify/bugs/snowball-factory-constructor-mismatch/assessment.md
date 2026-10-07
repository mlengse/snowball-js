# Bug Assessment: snowball factory constructor vs CJS runtime mismatch

- **Slug**: snowball-factory-constructor-mismatch
- **Created**: 2026-10-07T17:15:00Z
- **Source**: pasted text
- **Verdict**: likely valid, needs reproduction
- **Severity**: medium

## Report (verbatim or summarized)

"the @mlengse/snowball-js@1.0.1 published d.ts (factory) vs. CJS runtime (constructor) mismatch is worth an issue"

## Symptom

The TypeScript declarations in the published package describe Snowball as a factory that returns a Stemmer instance (function), but at runtime the CommonJS build may be consumed in ways that expose constructor vs factory behavior differently. [NEEDS CLARIFICATION: exact runtime error or import pattern causing mismatch]

## Reproduction

1. [NEEDS CLARIFICATION: import pattern - ESM vs CJS vs bundler]
2. [NEEDS CLARIFICATION: environment (Node, bundler, TS config)]
3. [NEEDS CLARIFICATION: minimal reproduction case]

## Suspected Code Paths

- `index.d.ts:1-19` — Type declarations export `declare function Snowball(language: Language): Stemmer;` and `export default Snowball;`
- `build.js` — Builds CJS factory at `dist/Snowball.js` that takes `(lng)` and returns `new stemFactory[stemName]()`; also builds per-language bundles
- `index.mjs` — Re-exports from `./dist/Snowball.js`
- `stemmer/src/SnowballProgram.js` — Core stemmer runtime class/object

## Root Cause Hypothesis

The type definition says `Snowball` is called as a function returning a `Stemmer`. The build produces a CJS module that exports `Snowball` as the factory function (module.exports = Snowball;). However, there may be confusion in how the module is consumed (default import vs named import) or the index.d.ts might need alignment with actual runtime shape across ESM/CJS entrypoints. Also the package.json points `types` to `index.d.ts` which matches the factory form. With the reported "factory vs constructor" mismatch, likely the runtime is being treated as a class constructor in some context while types say factory - or vice versa. Confidence: medium.

## Proposed Remediation

**Preferred**: Align TypeScript declarations and/or runtime export to match the published shape consistently. Since build.js currently exports a factory function and index.d.ts matches that, the fix is to ensure the public API is clearly documented as factory and that both ESM and CJS types/defaults match. Also verify the per-language bundles have correct .d.ts.

**Alternatives** (optional):
- Support both factory and constructor forms for backward compatibility (more complex)
- Change runtime to export a class/constructor if that was intended (would be breaking change in behavior)

**Files likely to change**:
- `index.d.ts` (clarify if needed)
- `build.js` (ensure consistent exports)
- Possibly generated .d.ts files in build output or their templates

**Tests to add or update**:
- Add runtime tests verifying import patterns (require vs import) return expected Stemmer shape
- Type-level smoke tests if available

## Risks & Considerations

- Changing runtime API shape is breaking for consumers
- Need to be careful about ESM default/named export interop
- Build output is generated - changes must be in build.js/source

## Open Questions

- [NEEDS CLARIFICATION: what exact code fails - e.g., `new Snowball('english')` vs `Snowball('english')`?]
- [NEEDS CLARIFICATION: which entrypoint is used (main/module/exports)?]
