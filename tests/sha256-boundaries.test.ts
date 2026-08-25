import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA256 } from "../src/sha256/index.js";

const lengths = [
	0,
	1,
	54,
	55,
	56,
	57,
	62,
	63,
	64,
	65,

	118,
	119,
	120,
	121,
	126,
	127,
	128,
	129
];

function createInput(length: number): Uint8Array {
	const input = new Uint8Array(length);

	for (let i = 0; i < length; i++) {
		input[i] = (i * 31 + 17) & 0xff;
	}

	return input;
}

function nodeSHA256(
	input: Uint8Array
): string {
	return createHash("sha256")
		.update(input)
		.digest("hex");
}

for (const length of lengths) {
	const input = createInput(length);

	assert.equal(
		new SHA256()
			.update(input)
			.digest("hex"),
		nodeSHA256(input),
		`SHA-256 failed at ${length} bytes`
	);
}