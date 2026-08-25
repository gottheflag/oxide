# Oxide

A small, composable hashing and message authentication library for JavaScript and TypeScript.

Oxide provides streaming SHA and HMAC implementations with a consistent API, zero runtime dependencies, and support for both ESM and CommonJS.

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

## Hashing

Oxide currently supports:

| Algorithm | Import |
| --- | --- |
| SHA-1 | `@gottheflag/oxide/sha1` |
| SHA-224 | `@gottheflag/oxide/sha224` |
| SHA-256 | `@gottheflag/oxide/sha256` |
| SHA-384 | `@gottheflag/oxide/sha384` |
| SHA-512 | `@gottheflag/oxide/sha512` |
| SHA-512/224 | `@gottheflag/oxide/sha512-224` |
| SHA-512/256 | `@gottheflag/oxide/sha512-256` |

```ts
import { SHA256 } from "@gottheflag/oxide/sha256";

const digest = new SHA256()
	.update("Hello, world!")
	.digest("hex");

console.log(digest);
```

Hashes can be updated incrementally:

```ts
const hash = new SHA512();

hash
	.update("Hello, ")
	.update("world!");

const digest = hash.digest("hex");
```

## HMAC

HMAC is available for every hashing algorithm provided by Oxide:

```ts
import { HMAC } from "@gottheflag/oxide/hmac";

const digest = HMAC
	.sha256("secret")
	.update("Hello, world!")
	.digest("hex");

console.log(digest);
```

Available factories:

```ts
HMAC.sha1(key);
HMAC.sha224(key);
HMAC.sha256(key);
HMAC.sha384(key);
HMAC.sha512(key);
HMAC.sha512_224(key);
HMAC.sha512_256(key);
```

HMAC supports streaming in the same way as hashes:

```ts
const hmac = HMAC.sha512(key);

for (const chunk of chunks) {
	hmac.update(chunk);
}

const digest = hmac.digest("hex");
```

## Input

`update()` and HMAC keys accept strings, `ArrayBuffer`, and `ArrayBufferView` values.

```ts
const hash = new SHA256();

hash.update("Hello");

hash.update(
	new Uint8Array([
		0x20,
		0x77,
		0x6f,
		0x72,
		0x6c,
		0x64
	])
);

hash.update(
	new ArrayBuffer(8)
);
```

Strings are encoded as UTF-8.

Oxide does not implicitly normalize Unicode strings.

## Digests

`digest()` returns a `Uint8Array` by default:

```ts
const bytes = new SHA256()
	.update("Hello")
	.digest();
```

This can also be written explicitly:

```ts
const bytes = new SHA256()
	.update("Hello")
	.digest("bytes");
```

Hexadecimal output is available with:

```ts
const hex = new SHA256()
	.update("Hello")
	.digest("hex");
```

The same API is available for HMAC:

```ts
const bytes = HMAC
	.sha256("secret")
	.update("Hello")
	.digest();

const hex = HMAC
	.sha256("secret")
	.update("Hello")
	.digest("hex");
```

## Finalization

Calling `digest()` finalizes the hash or HMAC.

Repeated calls are safe and return the same result:

```ts
const hash = new SHA256()
	.update("Hello");

const first = hash.digest("hex");
const second = hash.digest("hex");

console.log(first === second); // true
```

Calling `update()` after finalization throws:

```ts
const hash = new SHA256()
	.update("Hello");

hash.digest();

hash.update("world"); // throws
```

Byte digests are returned as independent copies. Modifying a returned `Uint8Array` does not modify the internal digest.

## Custom rounds

Hash constructors accept an optional round count:

```ts
const hash = new SHA256(32);
```

Custom rounds exist for experimentation, education, and testing.

**Non-standard round counts do not produce standard SHA digests and must not be used as replacements for the standardized algorithms.**

Use the default constructor for normal hashing:

```ts
new SHA1();       // 80 rounds
new SHA224();     // 64 rounds
new SHA256();     // 64 rounds
new SHA384();     // 80 rounds
new SHA512();     // 80 rounds
new SHA512_224(); // 80 rounds
new SHA512_256(); // 80 rounds
```

HMAC always uses the standard configuration of its selected hash.

## CommonJS

CommonJS is supported through the same package entry points:

```js
const {
	SHA256
} = require("@gottheflag/oxide/sha256");

const {
	HMAC
} = require("@gottheflag/oxide/hmac");

const hash = new SHA256()
	.update("Hello")
	.digest("hex");

const mac = HMAC
	.sha256("secret")
	.update("Hello")
	.digest("hex");
```

## TypeScript

Oxide ships TypeScript declarations.

Common hash types are exported from the package root:

```ts
import {
	Hash
} from "@gottheflag/oxide";

import type {
	DigestEncoding,
	HashInput
} from "@gottheflag/oxide";

import {
	SHA256
} from "@gottheflag/oxide/sha256";

const hash: Hash =
	new SHA256();

const input: HashInput =
	"Hello, world!";

const encoding: DigestEncoding =
	"hex";

hash.update(input);

const digest =
	hash.digest(encoding);
```

## Security

SHA-1 is provided for compatibility with protocols and formats that still require it. It should not be selected for new security-sensitive designs where a modern alternative is available.

Custom-round hashes are non-standard and should only be used for experimentation, education, and testing.

For vulnerability reporting and the project's security policy, see [SECURITY.md](SECURITY.md).

## License

[Apache-2.0](LICENSE)