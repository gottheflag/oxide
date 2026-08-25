import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA256 } from "../src/sha256/index.js";

function createRandom(seed: number): () => number {
	let state = seed >>> 0;

	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;

		return state >>> 0;
	};
}

function nodeSHA256(
	input: Uint8Array
): string {
	return createHash("sha256")
		.update(input)
		.digest("hex");
}

const random = createRandom(
	0x53484132
);

for (let test = 0; test < 1_000; test++) {
	const length =
		random() % 8_193;

	const input =
		new Uint8Array(length);

	for (
		let i = 0;
		i < input.length;
		i++
	) {
		input[ i ] =
			random() & 0xff;
	}

	const expected =
		nodeSHA256(input);

	// One-shot
	assert.equal(
		new SHA256()
			.update(input)
			.digest("hex"),
		expected,
		`one-shot test ${test} failed at ${length} bytes`
	);

	// Random streaming
	const hash = new SHA256();

	let offset = 0;

	while (offset < input.length) {
		const remaining =
			input.length - offset;

		const chunkSize = Math.min(
			(random() % 257) + 1,
			remaining
		);

		hash.update(
			input.subarray(
				offset,
				offset + chunkSize
			)
		);

		offset += chunkSize;
	}

	assert.equal(
		hash.digest("hex"),
		expected,
		`streaming test ${test} failed at ${length} bytes`
	);
}