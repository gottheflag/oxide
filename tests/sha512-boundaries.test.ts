import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA512 } from "../src/sha512/index.js";

function nodeSHA512(
	input: Uint8Array
): string {
	return createHash("sha512")
		.update(input)
		.digest("hex");
}

const lengths = [
	0,
	1,

	// Padding boundary.
	110,
	111,
	112,
	113,

	// Block boundary.
	126,
	127,
	128,
	129,

	// Second padding boundary.
	238,
	239,
	240,
	241,

	// Second block boundary.
	254,
	255,
	256,
	257
];

for (const length of lengths) {
	const input = Uint8Array.from(
		{ length },
		(_, index) =>
			(index * 131 + 17) & 0xff
	);

	const expected =
		nodeSHA512(input);

	const actual =
		new SHA512()
			.update(input)
			.digest("hex");

	assert.equal(
		actual,
		expected,
		`SHA-512 failed at ${length} bytes`
	);
}