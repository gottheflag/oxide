import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA256 } from "../src/sha256/index.js";
import { writeUint32BE } from "../src/utils/bytes.js";

function hex(bytes: Uint8Array): string {
	return Buffer.from(bytes).toString("hex");
}

const lengthVectors = [
	{
		byteLength: 0n,
		high: 0x00000000,
		low: 0x00000000,
	},
	{
		byteLength: 1n,
		high: 0x00000000,
		low: 0x00000008,
	},
	{
		byteLength: 0x1fffffffn,
		high: 0x00000000,
		low: 0xfffffff8,
	},
	{
		// Exactly 2^32 bits.
		byteLength: 0x20000000n,
		high: 0x00000001,
		low: 0x00000000,
	},
	{
		// Largest byte length before the 64-bit bit counter wraps.
		byteLength: (1n << 61n) - 1n,
		high: 0xffffffff,
		low: 0xfffffff8,
	},
	{
		// 2^64 bits wraps to zero.
		byteLength: 1n << 61n,
		high: 0x00000000,
		low: 0x00000000,
	},
	{
		byteLength: (1n << 61n) + 1n,
		high: 0x00000000,
		low: 0x00000008,
	},
];

for (const vector of lengthVectors) {
	const output = new Uint8Array(8);

	writeUint32BE(
		output,
		0,
		vector.high
	);

	writeUint32BE(
		output,
		4,
		vector.low
	);

	assert.equal(
		hex(output),
		vector.high
			.toString(16)
			.padStart(8, "0") +
		vector.low
			.toString(16)
			.padStart(8, "0"),
		`failed to encode ${vector.byteLength} bytes`
	);
}

{
	const hash = new SHA256();

	const internal =
		hash as unknown as {
			bitLengthHigh: number;
			bitLengthLow: number;
		};

	internal.bitLengthHigh =
		0x12345678;

	internal.bitLengthLow =
		0xfffffff8;

	hash.update(
		new Uint8Array(1)
	);

	assert.equal(
		internal.bitLengthHigh,
		0x12345679,
		"SHA-256 must carry into the high length word"
	);

	assert.equal(
		internal.bitLengthLow,
		0,
		"SHA-256 low length word must wrap correctly"
	);
}

// Large streamed message without allocating the full message.

const chunk = new Uint8Array(
	64 * 1024
);

for (
	let i = 0;
	i < chunk.length;
	i++
) {
	chunk[ i ] =
		(i * 29 + 7) & 0xff;
}

const oxide = new SHA256();
const node = createHash("sha256");

// 16 MiB total.
for (
	let i = 0;
	i < 256;
	i++
) {
	oxide.update(chunk);
	node.update(chunk);
}

assert.equal(
	oxide.digest("hex"),
	node.digest("hex"),
	"failed to hash a large streamed message"
);