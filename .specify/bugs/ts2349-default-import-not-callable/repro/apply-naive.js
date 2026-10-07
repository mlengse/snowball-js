// PROTOTYPE helper (not applied to source). The NAIVE alternative: point BOTH the
// import and require type conditions at the ESM-style .d.mts. Expected to fix ESM but
// break CJS `import = require`, demonstrating both conditions need their own file.
const fs = require("fs");
const path = require("path");

const pkgPath = path.join(__dirname, "node_modules/@mlengse/snowball-js/package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

for (const key of [".", "./english"]) {
  pkg.exports[key].require.types = pkg.exports[key].import.types;
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("naive: require.types -> import.types (.d.mts)");
