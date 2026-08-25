import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA224 } from "../src/sha224/index.js";

function createRandom(seed: number): () => number {
	let state = seed >>> 0;

	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;

		return state >>> 0;
	};
}

function nodeSHA224(
	input: Uint8Array
): string {
	return createHash("sha224")
		.update(input)
		.digest("hex");
}

const random = createRandom(
	0x53483232
);

for (let test = 0; test < 250; test++) {
	const length =
		random() % 4_097;

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
		nodeSHA224(input);

	assert.equal(
		new SHA224()
			.update(input)
			.digest("hex"),
		expected,
		`SHA-224 randomized test ${test} failed at ${length} bytes`
	);

	const streaming = new SHA224();

	let offset = 0;

	while (offset < input.length) {
		const remaining =
			input.length - offset;

		const chunkSize = Math.min(
			(random() % 129) + 1,
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
		`SHA-224 streaming test ${test} failed at ${length} bytes`
	);
}