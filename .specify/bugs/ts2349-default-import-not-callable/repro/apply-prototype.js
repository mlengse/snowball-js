// PROTOTYPE helper (not applied to source). Repoints the copied package.json types
// for the root entrypoint and the "english" subpath at the .d.mts/.d.cts prototypes.
const fs = require("fs");
const path = require("path");

const pkgPath = path.join(__dirname, "node_modules/@mlengse/snowball-js/package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

function repoint(entry, ext) {
  if (entry && entry.types) entry.types = entry.types.replace(/\.d\.ts$/, ext);
}

for (const [key, value] of Object.entries(pkg.exports)) {
  if (key !== "." && key !== "./english") continue;
  repoint(value.import, ".d.mts");
  repoint(value.require, ".d.cts");
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log('repointed root + "./english" types to .d.mts / .d.cts');
