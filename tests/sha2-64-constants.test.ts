import assert from "node:assert/strict";

import {
	SHA512_INITIAL
} from "../src/sha512/constants.js";

import {
	SHA2_64_K
} from "../src/sha2/64/constants.js";

assert.equal(
	SHA512_INITIAL.length,
	16,
	"SHA-512 must have 8 × 64-bit initial words"
);

assert.equal(
	SHA2_64_K.length,
	160,
	"SHA-2/64 must have 80 × 64-bit round constants"
);

assert.deepEqual(
	Array.from(SHA512_INITIAL.slice(0, 2)),
	[
		0x6a09e667,
		0xf3bcc908
	]
);

assert.deepEqual(
	Array.from(SHA2_64_K.slice(0, 2)),
	[
		0x428a2f98,
		0xd728ae22
	]
);

assert.deepEqual(
	Array.from(SHA2_64_K.slice(-2)),
	[
		0x6c44198c,
		0x4a475817
	]
);