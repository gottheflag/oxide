import assert from "node:assert/strict";

import {
	rotl32,
	rotr32
} from "../src/utils/bits.js";

assert.equal(
	rotr32(0x12345678, 4),
	0x81234567
);

assert.equal(
	rotr32(0x12345678, 8),
	0x78123456
);

assert.equal(
	rotr32(0x80000001, 1),
	0xc0000000
);

assert.equal(
	rotr32(0xffffffff, 17),
	0xffffffff
);

assert.equal(
	rotr32(0x12345678, 32),
	0x12345678
);

assert.equal(
	rotl32(
		rotr32(0xdeadbeef, 13),
		13
	),
	0xdeadbeef
);