#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'stemmer', 'src');
const LIB = path.join(__dirname, 'stemmer', 'lib');

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

fs.writeFileSync(path.join(__dirname, 'stemmer', 'lib', 'Snowball.js'), output);
console.log('Build complete: stemmer/lib/Snowball.js');

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
