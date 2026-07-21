# @mlengse/snowball-js

JavaScript port of the [Snowball stemming algorithms](https://snowball.tartarus.org/).

## Install

```sh
npm install @mlengse/snowball-js
```

## Usage

### CommonJS

```js
const Snowball = require('@mlengse/snowball-js');

const stemmer = Snowball('english');
stemmer.setCurrent('running');
stemmer.stem();
console.log(stemmer.getCurrent()); // 'run'
```

### ES Modules

```js
import Snowball from '@mlengse/snowball-js';

const stemmer = Snowball('english');
stemmer.setCurrent('running');
stemmer.stem();
console.log(stemmer.getCurrent()); // 'run'
```

### Per-language import (tree-shakeable)

```js
// Only loads the English stemmer (~30KB instead of ~200KB)
import EnglishStemmer from '@mlengse/snowball-js/english';

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
| Danish | `require('@mlengse/snowball-js/danish')` |
| Dutch | `require('@mlengse/snowball-js/dutch')` |
| English | `require('@mlengse/snowball-js/english')` |
| Finnish | `require('@mlengse/snowball-js/finnish')` |
| French | `require('@mlengse/snowball-js/french')` |
| German | `require('@mlengse/snowball-js/german')` |
| Hungarian | `require('@mlengse/snowball-js/hungarian')` |
| Indonesian | `require('@mlengse/snowball-js/indonesian')` |
| Italian | `require('@mlengse/snowball-js/italian')` |
| Norwegian | `require('@mlengse/snowball-js/norwegian')` |
| Portuguese | `require('@mlengse/snowball-js/portuguese')` |
| Romanian | `require('@mlengse/snowball-js/romanian')` |
| Russian | `require('@mlengse/snowball-js/russian')` |
| Spanish | `require('@mlengse/snowball-js/spanish')` |
| Swedish | `require('@mlengse/snowball-js/swedish')` |
| Turkish | `require('@mlengse/snowball-js/turkish')` |

## TypeScript

TypeScript declarations are included. Per-language imports are fully typed:

```ts
import EnglishStemmer, { Stemmer } from '@mlengse/snowball-js/english';

const stemmer: Stemmer = EnglishStemmer();
stemmer.setCurrent('running');
stemmer.stem();
```

## Development

```sh
npm install
npm run build    # Bundle stemmer/src/ → dist/
npm run lint     # Run ESLint
npm run test     # Run test suite (339 tests)
```

## License

[Mozilla Public License 1.1](LICENSE)
