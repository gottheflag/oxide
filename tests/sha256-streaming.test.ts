import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA256 } from "../src/sha256/index.js";

function createInput(length: number): Uint8Array {
	const input = new Uint8Array(length);

	for (let i = 0; i < length; i++) {
		input[ i ] = (i * 37 + 11) & 0xff;
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

const input = createInput(4_097);
const expected = nodeSHA256(input);

const chunkSizes = [
	1,
	2,
	3,
	7,
	8,
	15,
	16,
	31,
	32,
	55,
	56,
	63,
	64,
	65,
	127,
	128,
	255,
	256,
	1_024
];

for (const chunkSize of chunkSizes) {
	const hash = new SHA256();

	for (
		let offset = 0;
		offset < input.length;
		offset += chunkSize
	) {
		hash.update(
			input.subarray(
				offset,
				Math.min(
					offset + chunkSize,
					input.length
				)
			)
		);
	}

	assert.equal(
		hash.digest("hex"),
		expected,
		`failed with ${chunkSize}-byte chunks`
	);
}

// Every possible two-part split

const splitInput = createInput(257);
const splitExpected = nodeSHA256(splitInput);

for (
	let split = 0;
	split <= splitInput.length;
	split++
) {
	assert.equal(
		new SHA256()
			.update(splitInput.subarray(0, split))
			.update(splitInput.subarray(split))
			.digest("hex"),
		splitExpected,
		`failed at split position ${split}`
	);
}

// Empty updates must be harmless

assert.equal(
	new SHA256()
		.update(new Uint8Array())
		.update(input.subarray(0, 64))
		.update(new Uint8Array())
		.update(input.subarray(64))
		.update(new Uint8Array())
		.digest("hex"),
	expected
);