// Runtime half of the verification: declaration/runtime parity for all 17 entrypoints, plus a
// call through each resolution mode. Run from this directory:  node parity.js
const fs = require("fs");
const path = require("path");

const LANGUAGES = [
  "danish", "dutch", "english", "finnish", "french", "german", "hungarian", "indonesian",
  "italian", "norwegian", "portuguese", "romanian", "russian", "spanish", "swedish", "turkish",
];

const pkgRoot = path.join(__dirname, "node_modules", "@mlengse", "snowball-js");

function namedExportOf(declFile) {
  const match = fs.readFileSync(declFile, "utf8").match(/export \{ (\w+) \};/);
  return match ? match[1] : null;
}

(async () => {
  const rows = [];

  const rootMod = await import("@mlengse/snowball-js");
  const rootNamed = namedExportOf(path.join(pkgRoot, "index.d.mts"));
  rows.push(["root", rootNamed, typeof rootMod.default === "function" && rootMod[rootNamed] === rootMod.default]);

  for (const lang of LANGUAGES) {
    const mod = await import(`@mlengse/snowball-js/${lang}`);
    const named = namedExportOf(path.join(pkgRoot, `dist/languages/${lang}.d.mts`));
    const ok = typeof mod.default === "function" && !!named && mod[named] === mod.default;
    rows.push([lang, named, ok]);
  }

  for (const [name, named, ok] of rows) {
    console.log(`${ok ? "OK  " : "FAIL"} ${name.padEnd(11)} named=${named}`);
  }
  const failures = rows.filter(([, , ok]) => !ok);
  console.log(failures.length === 0
    ? `DECLARATION/RUNTIME PARITY OK - all ${rows.length} entrypoints`
    : `PARITY FAILURES: ${failures.length}`);

  const esmRoot = await import("@mlengse/snowball-js");
  const s1 = esmRoot.default("english");
  s1.setCurrent("running"); s1.stem();

  const esmEnglish = await import("@mlengse/snowball-js/english");
  const s2 = esmEnglish.EnglishStemmer();
  s2.setCurrent("running"); s2.stem();

  const cjsRoot = require("@mlengse/snowball-js");
  const s3 = cjsRoot("english");
  s3.setCurrent("running"); s3.stem();

  const cjsEnglish = require("@mlengse/snowball-js/english");
  const s4 = cjsEnglish();
  s4.setCurrent("running"); s4.stem();

  console.log(`runtime: esm-default=${s1.getCurrent()} esm-named=${s2.getCurrent()} cjs-root=${s3.getCurrent()} cjs-lang=${s4.getCurrent()}`);
})();
