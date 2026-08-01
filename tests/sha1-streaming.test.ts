import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA1 } from "../src/sha1/index.js";

function createInput(length: number): Uint8Array {
	const input = new Uint8Array(length);

	for (let index = 0; index < length; index++) {
		input[index] = (index * 37 + 11) & 0xff;
	}

	return input;
}

function expected(input: Uint8Array): string {
	return createHash("sha1")
		.update(input)
		.digest("hex");
}

const input = createInput(4_097);
const expectedDigest = expected(input);

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
	1_024,
];

for (const chunkSize of chunkSizes) {
	const hash = new SHA1();

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
		expectedDigest,
		`failed with ${chunkSize}-byte chunks`
	);
}

// Every possible two-part split

const splitInput = createInput(257);
const splitExpected = expected(splitInput);

for (
	let split = 0;
	split <= splitInput.length;
	split++
) {
	assert.equal(
		new SHA1()
			.update(splitInput.subarray(0, split))
			.update(splitInput.subarray(split))
			.digest("hex"),
		splitExpected,
		`failed at split position ${split}`
	);
}

// Empty updates must have no effect

assert.equal(
	new SHA1()
		.update(new Uint8Array())
		.update(input.subarray(0, 64))
		.update(new Uint8Array())
		.update(input.subarray(64))
		.update(new Uint8Array())
		.digest("hex"),
	expectedDigest
);