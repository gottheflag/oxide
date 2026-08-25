import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
	HMAC
} from "../src/hmac/index.js";

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

const cases = [
	{
		name: "sha1",
		create: (key: Uint8Array) =>
			HMAC.sha1(key),
	},
	{
		name: "sha224",
		create: (key: Uint8Array) =>
			HMAC.sha224(key),
	},
	{
		name: "sha256",
		create: (key: Uint8Array) =>
			HMAC.sha256(key),
	},
	{
		name: "sha384",
		create: (key: Uint8Array) =>
			HMAC.sha384(key),
	},
	{
		name: "sha512",
		create: (key: Uint8Array) =>
			HMAC.sha512(key),
	},
	{
		name: "sha512-224",
		create: (key: Uint8Array) =>
			HMAC.sha512_224(key),
	},
	{
		name: "sha512-256",
		create: (key: Uint8Array) =>
			HMAC.sha512_256(key),
	},
];

const random =
	createRandom(0x484d4143);

for (const testCase of cases) {
	for (
		let test = 0;
		test < 250;
		test++
	) {
		const keyLength =
			random() % 257;

		const messageLength =
			random() % 8_193;

		const key =
			new Uint8Array(keyLength);

		const message =
			new Uint8Array(messageLength);

		for (
			let i = 0;
			i < key.length;
			i++
		) {
			key[ i ] =
				random() & 0xff;
		}

		for (
			let i = 0;
			i < message.length;
			i++
		) {
			message[ i ] =
				random() & 0xff;
		}

		const expected =
			createHmac(
				testCase.name,
				key
			)
				.update(message)
				.digest("hex");

		assert.equal(
			testCase
				.create(key)
				.update(message)
				.digest("hex"),
			expected,
			`${testCase.name} one-shot test ${test}`
		);

		const streaming =
			testCase.create(key);

		let offset = 0;

		while (
			offset < message.length
		) {
			const remaining =
				message.length - offset;

			const chunkSize =
				Math.min(
					(random() % 257) + 1,
					remaining
				);

			streaming.update(
				message.subarray(
					offset,
					offset + chunkSize
				)
			);

			offset += chunkSize;
		}

		assert.equal(
			streaming.digest("hex"),
			expected,
			`${testCase.name} streaming test ${test}`
		);
	}
}