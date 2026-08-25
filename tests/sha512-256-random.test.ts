import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
	SHA512_256
} from "../src/sha512-256/index.js";

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

function nodeSHA512_256(
	input: Uint8Array
): string {
	return createHash("sha512-256")
		.update(input)
		.digest("hex");
}

const random =
	createRandom(0x512256);

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
		nodeSHA512_256(input);

	assert.equal(
		new SHA512_256()
			.update(input)
			.digest("hex"),
		expected,
		`SHA-512/256 one-shot test ${test} failed at ${length} bytes`
	);

	const streaming =
		new SHA512_256();

	let offset = 0;

	while (offset < input.length) {
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
		`SHA-512/256 streaming test ${test} failed at ${length} bytes`
	);
}