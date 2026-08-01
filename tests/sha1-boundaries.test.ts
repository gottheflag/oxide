import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA1 } from "../src/sha1/index.js";

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
	129,
];

function createInput(length: number): Uint8Array {
	const input = new Uint8Array(length);

	for (let index = 0; index < length; index++) {
		input[ index ] = (index * 31 + 17) & 0xff;
	}

	return input;
}

function nodeSHA1(input: Uint8Array): string {
	return createHash("sha1")
		.update(input)
		.digest("hex");
}

for (const length of lengths) {
	const input = createInput(length);

	assert.equal(
		new SHA1()
			.update(input)
			.digest("hex"),
		nodeSHA1(input),
		`SHA-1 failed at ${length} bytes`
	);
}