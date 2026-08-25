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

function createInput(
	length: number
): Uint8Array {
	return Uint8Array.from(
		{ length },
		(_, index) =>
			(index * 197 + 73) & 0xff
	);
}

const input =
	createInput(8_193);

const expected =
	nodeSHA512(input);

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
	63,
	64,
	111,
	112,
	127,
	128,
	129,
	255,
	256,
	511,
	512,
	1024
];

for (const chunkSize of chunkSizes) {
	const hash = new SHA512();

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
		`SHA-512 failed with ${chunkSize}-byte chunks`
	);
}

// Every possible two-way split.
{
	const splitInput =
		createInput(513);

	const splitExpected =
		nodeSHA512(splitInput);

	for (
		let split = 0;
		split <= splitInput.length;
		split++
	) {
		const hash = new SHA512();

		hash.update(
			splitInput.subarray(
				0,
				split
			)
		);

		hash.update(
			splitInput.subarray(
				split
			)
		);

		assert.equal(
			hash.digest("hex"),
			splitExpected,
			`SHA-512 failed at split ${split}`
		);
	}
}

// Empty updates must be harmless.
{
	const hash = new SHA512();

	hash.update(
		new Uint8Array()
	);

	hash.update("abc");

	hash.update(
		new Uint8Array()
	);

	assert.equal(
		hash.digest("hex"),
		nodeSHA512(
			new TextEncoder()
				.encode("abc")
		)
	);
}