# Reproduction harness — TS2349 default-import-not-callable

Disposable, offline scratch project used to reproduce the defect and validate the proposed fix.
Nothing here is applied to source, and `node_modules/` is intentionally not committed.

The copied package is regenerated from the repository root with:

```sh
mkdir -p .specify/bugs/ts2349-default-import-not-callable/repro/node_modules/@mlengse/snowball-js
cp -r dist index.mjs index.d.ts package.json \
  .specify/bugs/ts2349-default-import-not-callable/repro/node_modules/@mlengse/snowball-js/
```

`package.json` (this directory) deliberately carries a **different** `name` so the import resolves
through `node_modules` instead of the package's own name (self-reference), which would otherwise
silently test the repository's own `index.d.ts`.

## Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | `nodenext`, `strict`, `skipLibCheck: false`; includes `*.mts` and `*.cts` |
| `esm-default-root.mts` | Expected to fail (TS2349): root ESM default import must be callable |
| `esm-default-lang.mts` | Expected to fail (TS2349): per-language ESM default import must be callable |
| `cjs-require-root.cts` | Expected to fail (TS2349): `import = require` must be callable |
| `cjs-types-root.cts` | CJS consumer reaching types via the merged namespace |
| `esm-named-root.mts` | Control: named import passes and its `@ts-expect-error` is consumed |
| `proto-index.d.mts` / `proto-index.d.cts` | Prototype ESM / CJS root declarations |
| `proto-english.d.mts` / `proto-english.d.cts` | Prototype ESM / CJS per-language declarations |
| `apply-prototype.js` | Copies the prototypes in and repoints the export-map `types` conditions |
| `apply-naive.js` | Shows the naive alternative (both conditions → `.d.mts`) fixes ESM but breaks CJS |

## Commands

From this directory:

```sh
cp proto-index.d.mts   node_modules/@mlengse/snowball-js/index.d.mts
cp proto-index.d.cts   node_modules/@mlengse/snowball-js/index.d.cts
cp proto-english.d.mts node_modules/@mlengse/snowball-js/dist/languages/english.d.mts
cp proto-english.d.cts node_modules/@mlengse/snowball-js/dist/languages/english.d.cts
node apply-prototype.js
../../../../node_modules/.bin/tsc -p tsconfig.json          # baseline: 4 x TS2349; prototype: 0
```

Restore the pristine package manifest with:

```sh
cp ../../../../package.json node_modules/@mlengse/snowball-js/package.json
```

## Observed results

- Baseline (current published surface): 4 × `TS2349`, on ESM default (root + `english`) and CJS
  `import = require`; the named-import control compiles and consumes its `@ts-expect-error`.
- Runtime: ESM default, per-language default and CJS `require` all return `run` — the code works,
  only the declarations are wrong.
- Prototype (dual `.d.mts`/`.d.cts` + repointed conditions): **0 errors**.
- Naive (both conditions → `.d.mts`): ESM fixed, the 2 CJS cells still fail.
