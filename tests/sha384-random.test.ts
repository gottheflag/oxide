import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SHA384 } from "../src/sha384/index.js";

function createRandom(
	seed: number
): () => number {
	let state = seed >>> 0;

	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;

		return state >>> 0;
	};
}

function nodeSHA384(
	input: Uint8Array
): string {
	return createHash("sha384")
		.update(input)
		.digest("hex");
}

const random =
	createRandom(0x53483338);

for (
	let test = 0;
	test < 300;
	test++
) {
	const length =
		random() % 8_193;

	const input =
		new Uint8Array(length);

	for (
		let i = 0;
		i < input.length;
		i++
	) {
		input[i] =
			random() & 0xff;
	}

	const expected =
		nodeSHA384(input);

	assert.equal(
		new SHA384()
			.update(input)
			.digest("hex"),
		expected,
		`SHA-384 one-shot test ${test} failed at ${length} bytes`
	);

	const streaming =
		new SHA384();

	let offset = 0;

	while (
		offset < input.length
	) {
		const remaining =
			input.length - offset;

		const chunkSize =
			Math.min(
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
		`SHA-384 streaming test ${test} failed at ${length} bytes`
	);
}