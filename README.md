# snowball-js

JavaScript port of the [Snowball stemming algorithms](https://snowball.tartarus.org/).

## Install

```sh
npm install snowball
```

## Usage

### CommonJS

```js
const Snowball = require('snowball');

const stemmer = Snowball('english');
stemmer.setCurrent('running');
stemmer.stem();
console.log(stemmer.getCurrent()); // 'run'
```

### ES Modules

```js
import Snowball from 'snowball';

const stemmer = Snowball('english');
stemmer.setCurrent('running');
stemmer.stem();
console.log(stemmer.getCurrent()); // 'run'
```

### Per-language import (tree-shakeable)

```js
// Only loads the English stemmer (~30KB instead of ~200KB)
import EnglishStemmer from 'snowball/english';

const stemmer = EnglishStemmer();
stemmer.setCurrent('running');
stemmer.stem();
console.log(stemmer.getCurrent()); // 'run'
```

## API

```js
const stemmer = Snowball(language);
```

| Method | Description |
|--------|-------------|
| `setCurrent(word)` | Set the word to be stemmed |
| `getCurrent()` | Get the stemmed word (consumes the value, returns `null` on second call) |
| `stem()` | Perform stemming, returns `true` on success |

## Supported Languages

| Language | Import |
|----------|--------|
| Danish | `require('snowball/danish')` |
| Dutch | `require('snowball/dutch')` |
| English | `require('snowball/english')` |
| Finnish | `require('snowball/finnish')` |
| French | `require('snowball/french')` |
| German | `require('snowball/german')` |
| Hungarian | `require('snowball/hungarian')` |
| Indonesian | `require('snowball/indonesian')` |
| Italian | `require('snowball/italian')` |
| Norwegian | `require('snowball/norwegian')` |
| Portuguese | `require('snowball/portuguese')` |
| Romanian | `require('snowball/romanian')` |
| Russian | `require('snowball/russian')` |
| Spanish | `require('snowball/spanish')` |
| Swedish | `require('snowball/swedish')` |
| Turkish | `require('snowball/turkish')` |

## TypeScript

TypeScript declarations are included. Per-language imports are fully typed:

```ts
import EnglishStemmer, { Stemmer } from 'snowball/english';

const stemmer: Stemmer = EnglishStemmer();
stemmer.setCurrent('running');
stemmer.stem();
```

## Development

```sh
npm install
npm run build    # Bundle stemmer/src/ → stemmer/lib/
npm run lint     # Run ESLint
npm run test     # Run test suite (339 tests)
```

## License

[Mozilla Public License 1.1](LICENSE)
