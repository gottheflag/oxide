# Oxide

A secure, extensible hashing library.

## Installation

```sh
npm install @gottheflag/oxide
```

```sh
pnpm add @gottheflag/oxide
```

```sh
yarn add @gottheflag/oxide
```

## Usage

```ts
import { SHA1 } from "@gottheflag/oxide/sha1";

const sha1 = new SHA1();

sha1.update("Hello, world!");

console.log(sha1.digest("hex"));
```

Digest bytes can also be returned:

```ts
const bytes = sha1.digest();
```

CommonJS is also supported:

```js
const { SHA1 } = require("@gottheflag/oxide/sha1");

const sha1 = new SHA1();

sha1.update("Hello, world!");

console.log(sha1.digest("hex"));
```

## License

[Apache-2.0](LICENSE)
