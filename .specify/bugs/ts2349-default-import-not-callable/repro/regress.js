// Temporary regression-sensitivity toggle for the ts2349 fix. Run from the repository root,
// then restore package.json. Not part of the fix.
const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(process.cwd(), "package.json");
const mode = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

if (mode === "break-esm") {
  // Reintroduce the defect for the ESM surface: point the import condition at the CJS file.
  pkg.exports["."].import.types = "./index.d.ts";
}
if (mode === "break-cjs") {
  // Break the CJS surface: point the require condition at the ESM declaration.
  pkg.exports["."].require.types = "./index.d.mts";
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("applied", mode);
