import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA1 } from "../src/sha1/index.js";

function createRandom(seed: number): () => number {
	let state = seed >>> 0;

	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;

		return state >>> 0;
	};
}

function nodeSHA1(input: Uint8Array): string {
	return createHash("sha1")
		.update(input)
		.digest("hex");
}

const random = createRandom(0x4f584944);

for (let test = 0; test < 1_000; test++) {
	const length = random() % 8_193;
	const input = new Uint8Array(length);

	for (let index = 0; index < input.length; index++) {
		input[index] = random() & 0xff;
	}

	const expected = nodeSHA1(input);

	assert.equal(
		new SHA1()
			.update(input)
			.digest("hex"),
		expected,
		`one-shot randomized test ${test} failed at ${length} bytes`
	);

	const streaming = new SHA1();

	let offset = 0;

	while (offset < input.length) {
		const remaining = input.length - offset;
		const chunkSize = Math.min(
			(random() % 257) + 1,
			remaining
		);

		streaming.update(
			input.subarray(
				offset,
				offset + chunkSize
			)
		);

		offset += chunkSize;
	}

	assert.equal(
		streaming.digest("hex"),
		expected,
		`streaming randomized test ${test} failed at ${length} bytes`
	);
}