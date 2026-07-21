#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'stemmer', 'src');
const DIST = path.join(__dirname, 'dist');
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

const license = `/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */`;

const among = fs.readFileSync(path.join(SRC, 'Among.js'), 'utf8');
const snowballProgram = fs.readFileSync(path.join(SRC, 'SnowballProgram.js'), 'utf8');

const extDir = path.join(SRC, 'ext');
const stemmers = fs.readdirSync(extDir)
  .filter(f => f.endsWith('.js'))
  .sort()
  .map(f => fs.readFileSync(path.join(extDir, f), 'utf8'));

const stemFactoryEntries = stemmers.map(src => {
  const match = src.match(/function\s+(\w+Stemmer)\s*\(/);
  const name = match[1];
  return `\t\t${name} : function() {\n${indent(extractBody(src), 2)}\n\t\t}`;
}).join(',\n');

const output = `${license}

module.exports = Snowball;
function Snowball(lng) {
${indent(among, 1)}
${indent(snowballProgram, 1)}
	var stemFactory = {
${stemFactoryEntries}
	};
	var stemName = lng.substring(0, 1).toUpperCase()
			+ lng.substring(1).toLowerCase() + "Stemmer";
	return new stemFactory[stemName]();
}
`;

fs.writeFileSync(path.join(DIST, 'Snowball.js'), output);
console.log('Build complete: dist/Snowball.js');

const languagesDir = path.join(DIST, 'languages');
if (!fs.existsSync(languagesDir)) {
  fs.mkdirSync(languagesDir, { recursive: true });
}

const languageNames = [];
stemmers.forEach((src, i) => {
  const match = src.match(/function\s+(\w+Stemmer)\s*\(/);
  const className = match[1];
  const langName = className.replace('Stemmer', '').toLowerCase();
  languageNames.push(langName);

  const body = extractBody(src);
  const perLangOutput = `${license}

module.exports = ${className};
${indent(among, 0)}
${indent(snowballProgram, 0)}
function ${className}() {
${indent(body, 1)}
}
`;

  fs.writeFileSync(path.join(languagesDir, `${langName}.js`), perLangOutput);
  fs.writeFileSync(path.join(languagesDir, `${langName}.mjs`),
    `import ${className} from './${langName}.js';\nexport default ${className};\nexport { ${className} };\n`
  );
  fs.writeFileSync(path.join(languagesDir, `${langName}.d.ts`),
    `export interface Stemmer {\n  setCurrent(word: string): void;\n  getCurrent(): string | null;\n  stem(): boolean;\n}\n\nexport default function ${className}(): Stemmer;\n`
  );
});

const langExports = languageNames.map(l =>
  `    "./${l}": {\n      "import": "./languages/${l}.mjs",\n      "require": "./languages/${l}.js"\n    }`
).join(',\n');

const exportsField = {
  ".": {
    "import": {
      "types": "./index.d.ts",
      "default": "./index.mjs"
    },
    "require": {
      "types": "./index.d.ts",
      "default": "./dist/Snowball.js"
    }
  }
};
languageNames.forEach(l => {
  exportsField[`./${l}`] = {
    "import": {
      "types": `./dist/languages/${l}.d.ts`,
      "default": `./dist/languages/${l}.mjs`
    },
    "require": {
      "types": `./dist/languages/${l}.d.ts`,
      "default": `./dist/languages/${l}.js`
    }
  };
});

const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.exports = exportsField;
pkg.files = [
  "dist/",
  "index.mjs",
  "index.d.ts"
];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Build complete: ${languageNames.length} per-language bundles in dist/languages/`);
console.log('Updated package.json exports field');

function extractBody(src) {
  const lines = src.split('\n');
  let depth = 0;
  let started = false;
  const body = [];
  for (const line of lines) {
    if (!started) {
      if (line.match(/function\s+\w+Stemmer\s*\(/)) {
        started = true;
        depth = 0;
      } else {
        continue;
      }
    }
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    body.push(line);
    if (started && depth === 0) break;
  }
  const inner = body.join('\n');
  const firstBrace = inner.indexOf('{');
  const lastBrace = inner.lastIndexOf('}');
  return inner.substring(firstBrace + 1, lastBrace);
}

function indent(text, tabs) {
  const prefix = '\t'.repeat(tabs);
  return text.split('\n').map(line => line.trim() ? prefix + line : '').join('\n');
}
