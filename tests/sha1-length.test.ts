import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA1 } from "../src/sha1/index.js";
import { writeUint64BE } from "../src/utils/bytes.js";

function hex(bytes: Uint8Array): string {
	return Buffer
		.from(bytes)
		.toString("hex");
}

const lengthVectors = [
	{
		byteLength: 0n,
		expected: "0000000000000000",
	},
	{
		byteLength: 1n,
		expected: "0000000000000008",
	},
	{
		// One byte before the 32-bit bit-length boundary
		byteLength: 0x1fffffffn,
		expected: "00000000fffffff8",
	},
	{
		// Exactly 2^32 bits
		byteLength: 0x20000000n,
		expected: "0000000100000000",
	},
	{
		// Largest byte length before the 64-bit bit count wraps
		byteLength: (1n << 61n) - 1n,
		expected: "fffffffffffffff8",
	},
	{
		// 2^64 bits wraps to zero
		byteLength: 1n << 61n,
		expected: "0000000000000000",
	},
	{
		byteLength: (1n << 61n) + 1n,
		expected: "0000000000000008",
	},
];

for (const vector of lengthVectors) {
	const output = new Uint8Array(8);

	const bitLength = BigInt.asUintN(
		64,
		vector.byteLength * 8n
	);

	writeUint64BE(
		output,
		0,
		bitLength
	);

	assert.equal(
		hex(output),
		vector.expected,
		`failed to encode ${vector.byteLength} bytes`
	);
}

// Large streamed message without allocating the entire input

const chunk = new Uint8Array(64 * 1024);

for (let index = 0; index < chunk.length; index++) {
	chunk[index] = (index * 29 + 7) & 0xff;
}

const oxide = new SHA1();
const node = createHash("sha1");

// 16 MiB total
for (let index = 0; index < 256; index++) {
	oxide.update(chunk);
	node.update(chunk);
}

assert.equal(
	oxide.digest("hex"),
	node.digest("hex"),
	"failed to hash a large streamed message"
);