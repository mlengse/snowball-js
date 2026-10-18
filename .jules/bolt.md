## 2025-05-18 - [Snowball Program Loop & Property Optimization]
**Learning:** In hot execution paths like `find_among_internal`, accessing nested properties (e.g. `w.s`, `w.s_size`) repeatedly inside tight comparison loops incurs noticeable property lookup overhead in V8. Hoisting these properties to local variables (`ws`, `ws_size`) and eliminating repeated cursor index recalculation (`c - 1 - common` -> `c_common--`) improves execution speed by ~10-12% during string matching.
**Action:** When optimizing tight inner loops in performance-critical core utility classes, hoist array/object property lookups outside or at the start of loop iterations and track offset positions incrementally.

## 2025-05-19 - [Hoisting Object Property Lookups in Cursor Helpers]
**Learning:** In high-frequency methods like `in_grouping`, `out_grouping`, `eq_s`, and `eq_s_b` called thousands of times per word in Snowball stemming, accessing `this.cursor` multiple times per invocation adds measurable member access overhead. Hoisting `this.cursor` to a local `cursor` variable and pre-calculating slice offsets reduces execution time by ~2-4% across multi-language benchmarks.
**Action:** Always cache instance property lookups (like `this.cursor`) into local variables at method entry when used repeatedly across conditional checks or character index arithmetic.
